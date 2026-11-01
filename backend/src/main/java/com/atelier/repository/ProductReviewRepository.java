package com.atelier.repository;

import com.atelier.catalog.dto.ProductRatingSummary;
import com.atelier.catalog.dto.RatingCount;
import com.atelier.catalog.entity.ProductReview;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    /**
     * Chỉ lấy đánh giá sản phẩm được hiển thị công khai.
     * Không dùng bảng reviews vì hiện bảng đó chưa có dữ liệu theo xác nhận của dự án.
     */
    @Query("""
            select new com.atelier.catalog.dto.ProductRatingSummary(
                review.product.id,
                avg(review.rating),
                count(review.id)
            )
            from ProductReview review
            where upper(review.status) = upper(:status)
              and review.product.id in :productIds
            group by review.product.id
            """)
    List<ProductRatingSummary> summarizeByProductIds(
            @Param("productIds") List<Long> productIds,
            @Param("status") String status
    );

    /** Danh sách đánh giá công khai của một sản phẩm, lọc theo số sao nếu có. */
    @EntityGraph(attributePaths = "user")
    @Query("""
            select review from ProductReview review
            where review.product.id = :productId
              and upper(review.status) = upper(:status)
              and (:rating is null or review.rating = :rating)
            """)
    Page<ProductReview> findReviews(
            @Param("productId") Long productId,
            @Param("status") String status,
            @Param("rating") Integer rating,
            Pageable pageable
    );

    /** Đếm số đánh giá theo từng mức sao để vẽ thanh phân bố 5 -> 1. */
    @Query("""
            select new com.atelier.catalog.dto.RatingCount(review.rating, count(review.id))
            from ProductReview review
            where review.product.id = :productId
              and upper(review.status) = upper(:status)
            group by review.rating
            """)
    List<RatingCount> countByRating(
            @Param("productId") Long productId,
            @Param("status") String status
    );

    /** Đánh giá của một người dùng cho một sản phẩm (kể cả đang bị ẩn). */
    @EntityGraph(attributePaths = {"user", "product"})
    Optional<ProductReview> findByProductIdAndUserId(Long productId, Long userId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);

    /** Danh sách đánh giá cho màn quản trị, gồm cả đánh giá đang bị ẩn. */
    @EntityGraph(attributePaths = {"user", "product"})
    @Query("""
            select review from ProductReview review
            where (:status is null or upper(review.status) = upper(:status))
              and (:rating is null or review.rating = :rating)
              and (:keyword is null
                   or lower(coalesce(review.comment, '')) like lower(concat('%', :keyword, '%'))
                   or lower(coalesce(review.user.fullName, '')) like lower(concat('%', :keyword, '%'))
                   or lower(coalesce(review.user.email, '')) like lower(concat('%', :keyword, '%'))
                   or lower(coalesce(review.product.name, '')) like lower(concat('%', :keyword, '%')))
            """)
    Page<ProductReview> findAdminReviews(
            @Param("status") String status,
            @Param("rating") Integer rating,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
