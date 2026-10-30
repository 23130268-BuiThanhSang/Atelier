package com.atelier.repository;

import com.atelier.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Tìm toàn bộ danh sách món hàng theo order_id
    List<OrderItem> findByOrderId(Long orderId);

    /**
     * Đếm số món hàng thuộc đơn đã giao/hoàn thành của người dùng có chứa sản phẩm.
     * Dùng để chặn đánh giá khi chưa mua hàng.
     */
    @Query("""
            select count(item)
            from OrderItem item
            where item.order.user.id = :userId
              and item.productVariant.product.id = :productId
              and upper(item.order.status) in ('COMPLETED', 'DELIVERED')
            """)
    long countCompletedPurchases(
            @Param("userId") Long userId,
            @Param("productId") Long productId
    );
}
