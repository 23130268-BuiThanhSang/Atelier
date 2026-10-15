package com.atelier.repository;

import com.atelier.catalog.entity.ProductVariant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    @Query("""
            select variant
            from ProductVariant variant
            where variant.product.id in :productIds
              and upper(variant.status) = 'ACTIVE'
            order by variant.id asc
            """)
    List<ProductVariant> findActiveCatalogVariants(@Param("productIds") List<Long> productIds);

    // Lấy [productId, SUM(stockQuantity)]
    @Query("""
        SELECT pv.product.id, COALESCE(SUM(pv.stockQuantity), 0)
        FROM ProductVariant pv
        WHERE pv.product.id IN :productIds
        GROUP BY pv.product.id
    """)
    List<Object[]> sumStockByProductIds(@Param("productIds") List<Long> productIds);
}
