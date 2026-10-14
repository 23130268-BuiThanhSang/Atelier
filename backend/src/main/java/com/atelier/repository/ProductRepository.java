package com.atelier.repository;

import com.atelier.catalog.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = "category")
    List<Product> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);
}
