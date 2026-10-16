package com.atelier.repository;

import com.atelier.production.entity.ProductionOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionOrderItemRepository extends JpaRepository<ProductionOrderItem, Long> {
    List<ProductionOrderItem> findByProductionOrderId(Long productionOrderId);
}