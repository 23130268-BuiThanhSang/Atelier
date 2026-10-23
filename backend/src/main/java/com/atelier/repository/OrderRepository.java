package com.atelier.repository;

import com.atelier.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:keyword IS NULL OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(o.shippingName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(o.shippingPhone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Order> findAdminOrders(
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(String status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status IN ('IN_PRODUCTION', 'QC_INSPECTION')")
    long countInProduction();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status IN ('CONFIRMED', 'PENDING', 'SHIPPED')")
    long countPendingDelivery();

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}