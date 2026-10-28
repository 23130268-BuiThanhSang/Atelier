package com.atelier.repository;

import com.atelier.production.entity.ProductionOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, Long> {

    @Query("SELECT po FROM ProductionOrder po WHERE " +
            "(:tab = 'all') OR " +
            "(:tab = 'confirmed' AND UPPER(po.status) IN ('CONFIRMED', 'DEPOSITED')) OR " +
            "(:tab = 'in-production' AND UPPER(po.status) = 'IN_PRODUCTION') OR " +
            "(:tab = 'waiting-payment' AND UPPER(po.status) IN ('WAITING_PAYMENT', 'PAID_IN_FULL')) OR " +
            "(:tab = 'shipped' AND UPPER(po.status) = 'SHIPPED') OR " +
            "(:tab = 'completed' AND UPPER(po.status) IN ('DELIVERED', 'COMPLETED')) " +
            "ORDER BY po.createdAt DESC")
    List<ProductionOrder> findByTab(@Param("tab") String tab);
}