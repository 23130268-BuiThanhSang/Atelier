package com.atelier.repository;

import com.atelier.catalog.dto.ProductRatingSummary;
import com.atelier.catalog.entity.ProductReview;
import java.util.List;
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
}
