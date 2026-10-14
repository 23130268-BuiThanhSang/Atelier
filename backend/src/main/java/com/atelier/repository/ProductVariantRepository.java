package com.atelier.repository;

import com.atelier.catalog.entity.ProductVariant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    @Query("""
            select variant
            from ProductVariant variant
            where variant.product.id in :productIds
              and upper(variant.status) = 'ACTIVE'
            order by variant.id asc
            """)
    List<ProductVariant> findActiveCatalogVariants(@Param("productIds") List<Long> productIds);
}
