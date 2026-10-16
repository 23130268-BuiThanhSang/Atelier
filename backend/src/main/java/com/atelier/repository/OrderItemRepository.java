package com.atelier.repository;

import com.atelier.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Tìm toàn bộ danh sách món hàng theo order_id
    List<OrderItem> findByOrderId(Long orderId);
}