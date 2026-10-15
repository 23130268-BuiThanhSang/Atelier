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
            "(:tab = 'in-production' AND UPPER(po.status) = 'IN_PRODUCTION') OR " +
            "(:tab = 'pending-qc' AND UPPER(po.status) = 'QC_INSPECTION') OR " +
            "(:tab = 'completed' AND UPPER(po.status) IN ('SHIPPED', 'COMPLETED')) " +
            "ORDER BY po.createdAt DESC")
    List<ProductionOrder> findByTab(@Param("tab") String tab);
}