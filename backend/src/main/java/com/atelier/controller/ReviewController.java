package com.atelier.controller;

import com.atelier.catalog.dto.CreateReviewRequest;
import com.atelier.catalog.dto.MyReviewResponse;
import com.atelier.catalog.dto.ReviewPageResponse;
import com.atelier.catalog.dto.ReviewResponse;
import com.atelier.catalog.dto.UpdateReviewRequest;
import com.atelier.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** API công khai và API người dùng cho đánh giá sản phẩm. */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** Danh sách đánh giá đang hiển thị của một sản phẩm. */
    @GetMapping("/products/{productId}/reviews")
    public ReviewPageResponse getReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) Integer rating,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestHeader(value = "X-User-ID", required = false) Long userId
    ) {
        return reviewService.getProductReviews(productId, page, size, rating, sort, userId);
    }

    /** Trạng thái đánh giá của người dùng hiện tại (chưa đăng nhập vẫn gọi được). */
    @GetMapping("/products/{productId}/reviews/me")
    public MyReviewResponse getMyReview(
            @PathVariable Long productId,
            @RequestHeader(value = "X-User-ID", required = false) Long userId
    ) {
        return reviewService.getMyReview(productId, userId);
    }

    /** Gửi đánh giá mới cho sản phẩm. */
    @PostMapping("/products/{productId}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(
            @PathVariable Long productId,
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        return reviewService.createReview(productId, userId, request);
    }

    /** Sửa đánh giá của chính mình. */
    @PutMapping("/reviews/{id}")
    public ReviewResponse updateReview(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @Valid @RequestBody UpdateReviewRequest request
    ) {
        return reviewService.updateReview(id, userId, request);
    }

    /** Xóa đánh giá của chính mình. */
    @DeleteMapping("/reviews/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-ID", required = false) Long userId
    ) {
        reviewService.deleteReview(id, userId);
    }
}
