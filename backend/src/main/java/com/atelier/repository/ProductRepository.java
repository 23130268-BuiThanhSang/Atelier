package com.atelier.repository;

import com.atelier.catalog.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = "category")
    List<Product> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);

    // Tìm kiếm và phân trang kết hợp nhiều bộ lọc
    @SuppressWarnings("all")
    @Query(value = """
        SELECT p.* FROM products p
        LEFT JOIN (
            SELECT product_id, COALESCE(SUM(stock_quantity), 0) AS total_stock
            FROM product_variants
            GROUP BY product_id
        ) v ON p.id = v.product_id
        WHERE (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (
              :status IS NULL
              OR (:status = 'OUT_OF_STOCK' AND (COALESCE(v.total_stock, 0) = 0 OR p.status = 'OUT_OF_STOCK'))
              OR (:status = 'ACTIVE' AND p.status = 'ACTIVE' AND COALESCE(v.total_stock, 0) > 0)
              OR (:status = 'INACTIVE' AND p.status = 'INACTIVE')
          )
        ORDER BY p.id DESC
    """, countQuery = """
        SELECT COUNT(*) FROM products p
        LEFT JOIN (
            SELECT product_id, COALESCE(SUM(stock_quantity), 0) AS total_stock
            FROM product_variants
            GROUP BY product_id
        ) v ON p.id = v.product_id
        WHERE (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (
              :status IS NULL
              OR (:status = 'OUT_OF_STOCK' AND (COALESCE(v.total_stock, 0) = 0 OR p.status = 'OUT_OF_STOCK'))
              OR (:status = 'ACTIVE' AND p.status = 'ACTIVE' AND COALESCE(v.total_stock, 0) > 0)
              OR (:status = 'INACTIVE' AND p.status = 'INACTIVE')
          )
    """, nativeQuery = true)
    Page<Product> findForAdmin(
            @Param("keyword") String keyword,
            @Param("status") String status,
            Pageable pageable
    );

    // Đếm số sản phẩm hết hàng thực tế (tồn kho = 0 hoặc status OUT_OF_STOCK)
    @SuppressWarnings("all")
    @Query(value = """
        SELECT COUNT(p.id) FROM products p
        LEFT JOIN (
            SELECT product_id, COALESCE(SUM(stock_quantity), 0) AS total_stock
            FROM product_variants
            GROUP BY product_id
        ) v ON p.id = v.product_id
        WHERE COALESCE(v.total_stock, 0) = 0 OR p.status = 'OUT_OF_STOCK'
    """, nativeQuery = true)
    long countOutOfStockProducts();

    // Đếm số sản phẩm sắp hết hàng (tồn kho từ 1 đến 20 chiếc)
    @SuppressWarnings("all")
    @Query(value = """
        SELECT COUNT(p.id) FROM products p
        INNER JOIN (
            SELECT product_id, SUM(stock_quantity) AS total_stock
            FROM product_variants
            GROUP BY product_id
            HAVING SUM(stock_quantity) > 0 AND SUM(stock_quantity) <= 20
        ) v ON p.id = v.product_id
        WHERE p.status = 'ACTIVE'
    """, nativeQuery = true)
    long countLowStockProducts();

    // Đếm theo trạng thái
    long countByStatus(String status);

    // Cập nhật trạng thái sản phẩm
    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.status = :status, p.updatedAt = CURRENT_TIMESTAMP WHERE p.id = :id")
    int updateProductStatus(@Param("id") Long id, @Param("status") String status);

    // Cập nhật trạng thái hàng loạt
    @Modifying
    @Query("UPDATE Product p SET p.status = :status, p.updatedAt = CURRENT_TIMESTAMP WHERE p.id IN :ids")
    int updateBulkStatus(@Param("ids") List<Long> ids, @Param("status") String status);
}
