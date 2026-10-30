package com.atelier.service;

import com.atelier.catalog.dto.AdminReviewPageResponse;
import com.atelier.catalog.dto.AdminReviewResponse;
import com.atelier.catalog.dto.CreateReviewRequest;
import com.atelier.catalog.dto.MyReviewResponse;
import com.atelier.catalog.dto.RatingCount;
import com.atelier.catalog.dto.ReviewPageResponse;
import com.atelier.catalog.dto.ReviewResponse;
import com.atelier.catalog.dto.ReviewSummaryResponse;
import com.atelier.catalog.dto.UpdateReviewRequest;
import com.atelier.catalog.entity.Product;
import com.atelier.catalog.entity.ProductReview;
import com.atelier.common.exception.BusinessException;
import com.atelier.common.exception.ErrorCode;
import com.atelier.repository.OrderItemRepository;
import com.atelier.repository.ProductRepository;
import com.atelier.repository.ProductReviewRepository;
import com.atelier.repository.UserRepository;
import com.atelier.user.entity.User;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Nghiệp vụ đánh giá sản phẩm (bảng product_reviews). Chỉ người đã mua sản phẩm mới được đánh giá. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private static final String ACTIVE = "ACTIVE";
    private static final String VISIBLE = "VISIBLE";
    private static final String HIDDEN = "HIDDEN";
    private static final Set<String> ALLOWED_STATUSES = Set.of(VISIBLE, HIDDEN);
    private static final String DEFAULT_AUTHOR_NAME = "Người dùng Atelier";
    private static final int DEFAULT_PAGE_SIZE = 5;
    private static final int MAX_PAGE_SIZE = 50;

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    /** Danh sách đánh giá công khai kèm điểm tổng hợp và phân bố số sao. */
    public ReviewPageResponse getProductReviews(
            Long productId,
            int page,
            int size,
            Integer rating,
            String sort,
            Long currentUserId
    ) {
        requireActiveProduct(productId);

        Sort pageSort = resolveSort(sort);
        Pageable pageable = toPageable(page, size, pageSort);
        Page<ProductReview> reviews = reviewRepository.findReviews(
                productId,
                VISIBLE,
                normalizeRatingFilter(rating),
                pageable
        );

        ReviewSummaryResponse summary = buildSummary(productId);
        List<ReviewResponse> items = reviews.getContent().stream()
                .map(review -> toResponse(review, currentUserId))
                .toList();

        return new ReviewPageResponse(
                summary,
                items,
                reviews.getNumber(),
                reviews.getSize(),
                reviews.getTotalElements(),
                reviews.getTotalPages()
        );
    }

    /** Trạng thái đánh giá của người dùng hiện tại với một sản phẩm. */
    public MyReviewResponse getMyReview(Long productId, Long userId) {
        requireActiveProduct(productId);

        if (userId == null || !userRepository.existsById(userId)) {
            return new MyReviewResponse(false, "NOT_LOGGED_IN", null);
        }

        var existingReview = reviewRepository.findByProductIdAndUserId(productId, userId);
        if (existingReview.isPresent()) {
            return new MyReviewResponse(false, "ALREADY_REVIEWED", toResponse(existingReview.get(), userId));
        }

        if (!hasPurchased(userId, productId)) {
            return new MyReviewResponse(false, "NOT_PURCHASED", null);
        }

        return new MyReviewResponse(true, "CAN_REVIEW", null);
    }

    /** Tạo đánh giá mới; mỗi người dùng chỉ được một đánh giá cho mỗi sản phẩm và phải đã mua sản phẩm đó. */
    @Transactional
    public ReviewResponse createReview(Long productId, Long userId, CreateReviewRequest request) {
        User user = requireUser(userId);
        Product product = requireActiveProduct(productId);

        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new BusinessException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }
        if (!hasPurchased(userId, productId)) {
            throw new BusinessException(ErrorCode.REVIEW_NOT_ELIGIBLE);
        }

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.rating());
        review.setComment(normalizeComment(request.comment()));
        review.setStatus(VISIBLE);

        try {
            return toResponse(reviewRepository.save(review), userId);
        } catch (DataIntegrityViolationException ex) {
            // Trường hợp hai request gửi cùng lúc: unique (user_id, product_id) chặn ở DB.
            throw new BusinessException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }
    }

    /** Chỉ chủ đánh giá được sửa, và chỉ khi đánh giá chưa bị ẩn. */
    @Transactional
    public ReviewResponse updateReview(Long reviewId, Long userId, UpdateReviewRequest request) {
        User user = requireUser(userId);
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.REVIEW_NOT_OWNED);
        }
        if (!VISIBLE.equalsIgnoreCase(review.getStatus())) {
            throw new BusinessException(ErrorCode.REVIEW_NOT_EDITABLE);
        }

        review.setRating(request.rating());
        review.setComment(normalizeComment(request.comment()));
        return toResponse(reviewRepository.save(review), userId);
    }

    /** Chỉ chủ đánh giá được xóa. */
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        User user = requireUser(userId);
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.REVIEW_NOT_OWNED);
        }

        reviewRepository.delete(review);
    }

    /** Danh sách đánh giá cho quản trị viên, gồm cả đánh giá đang bị ẩn. */
    public AdminReviewPageResponse getAdminReviews(
            int page,
            int size,
            String keyword,
            Integer rating,
            String status
    ) {
        Sort sort = Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"));
        Pageable pageable = toPageable(page, size, sort);

        Page<ProductReview> reviews = reviewRepository.findAdminReviews(
                normalizeStatusFilter(status),
                normalizeRatingFilter(rating),
                normalizeKeyword(keyword),
                pageable
        );

        List<AdminReviewResponse> items = reviews.getContent().stream()
                .map(this::toAdminResponse)
                .toList();

        return new AdminReviewPageResponse(
                items,
                reviews.getNumber(),
                reviews.getSize(),
                reviews.getTotalElements(),
                reviews.getTotalPages()
        );
    }

    /** Ẩn hoặc hiện lại một đánh giá. */
    @Transactional
    public AdminReviewResponse updateReviewStatus(Long reviewId, String status) {
        String normalizedStatus = normalizeStatus(status);
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));

        review.setStatus(normalizedStatus);
        return toAdminResponse(reviewRepository.save(review));
    }

    /** Xóa vĩnh viễn một đánh giá. */
    @Transactional
    public void deleteReviewAsAdmin(Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));
        reviewRepository.delete(review);
    }

    private ReviewSummaryResponse buildSummary(Long productId) {
        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int star = 5; star >= 1; star--) {
            distribution.put(star, 0L);
        }

        long total = 0;
        long weightedTotal = 0;
        for (RatingCount item : reviewRepository.countByRating(productId, VISIBLE)) {
            if (item.rating() == null) {
                continue;
            }
            long count = item.total() == null ? 0L : item.total();
            if (distribution.containsKey(item.rating())) {
                distribution.put(item.rating(), count);
            }
            total += count;
            weightedTotal += (long) item.rating() * count;
        }

        double average = total == 0
                ? 0.0
                : Math.round(((double) weightedTotal / total) * 10.0) / 10.0;
        return new ReviewSummaryResponse(average, total, distribution);
    }

    private ReviewResponse toResponse(ProductReview review, Long currentUserId) {
        boolean mine = currentUserId != null
                && review.getUser() != null
                && currentUserId.equals(review.getUser().getId());
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                displayName(review.getUser()),
                review.getUser() == null ? null : review.getUser().getAvatarUrl(),
                review.getStatus(),
                review.getCreatedAt(),
                review.getUpdatedAt(),
                mine
        );
    }

    private AdminReviewResponse toAdminResponse(ProductReview review) {
        Product product = review.getProduct();
        User user = review.getUser();
        return new AdminReviewResponse(
                review.getId(),
                product == null ? null : product.getId(),
                product == null ? null : product.getName(),
                displayName(user),
                user == null ? null : user.getEmail(),
                review.getRating(),
                review.getComment(),
                review.getStatus(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }

    private String displayName(User user) {
        if (user == null || user.getFullName() == null || user.getFullName().isBlank()) {
            return DEFAULT_AUTHOR_NAME;
        }
        return user.getFullName().trim();
    }

    private User requireUser(Long userId) {
        if (userId == null) {
            throw new BusinessException(ErrorCode.LOGIN_REQUIRED);
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    /** Người dùng đã có đơn COMPLETED/DELIVERED chứa sản phẩm hay chưa. */
    private boolean hasPurchased(Long userId, Long productId) {
        return orderItemRepository.countCompletedPurchases(userId, productId) > 0;
    }

    private Product requireActiveProduct(Long productId) {
        return productRepository.findById(productId)
                .filter(product -> ACTIVE.equalsIgnoreCase(product.getStatus()))
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    private Pageable toPageable(int page, int size, Sort sort) {
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? DEFAULT_PAGE_SIZE : Math.min(size, MAX_PAGE_SIZE);
        return PageRequest.of(safePage, safeSize, sort);
    }

    private Sort resolveSort(String sort) {
        String key = sort == null ? "" : sort.trim().toLowerCase(Locale.ROOT);
        return switch (key) {
            case "oldest" -> Sort.by(Sort.Order.asc("createdAt"), Sort.Order.asc("id"));
            case "rating_desc" -> Sort.by(Sort.Order.desc("rating"), Sort.Order.desc("createdAt"));
            case "rating_asc" -> Sort.by(Sort.Order.asc("rating"), Sort.Order.desc("createdAt"));
            default -> Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"));
        };
    }

    private Integer normalizeRatingFilter(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            return null;
        }
        return rating;
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        return keyword.trim();
    }

    private String normalizeStatusFilter(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        return ALLOWED_STATUSES.contains(normalized) ? normalized : null;
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_REVIEW_STATUS);
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_STATUSES.contains(normalized)) {
            throw new BusinessException(ErrorCode.INVALID_REVIEW_STATUS);
        }
        return normalized;
    }

    private String normalizeComment(String comment) {
        if (comment == null) {
            return null;
        }
        String trimmed = comment.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
