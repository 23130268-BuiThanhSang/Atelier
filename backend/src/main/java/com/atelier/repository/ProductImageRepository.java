package com.atelier.repository;

import com.atelier.catalog.entity.ProductImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    /** Ưu tiên ảnh thumbnail; nếu không có thì lấy ảnh có display_order nhỏ nhất. */
    @Query("""
            select image
            from ProductImage image
            where image.product.id in :productIds
            order by image.isThumbnail desc, image.displayOrder asc, image.id asc
            """)
    List<ProductImage> findCatalogImages(@Param("productIds") List<Long> productIds);

    /** Lấy toàn bộ ảnh của một sản phẩm theo thứ tự hiển thị cho trang chi tiết. */
    @Query("""
            select image
            from ProductImage image
            where image.product.id = :productId
            order by image.isThumbnail desc, image.displayOrder asc, image.id asc
            """)
    List<ProductImage> findProductImages(@Param("productId") Long productId);

    List<ProductImage> findByProductIdInAndIsThumbnailTrue(List<Long> productIds);

    @Query(value = """
        SELECT product_id, image_url 
        FROM product_images 
        WHERE product_id IN :productIds AND is_thumbnail = 1
    """, nativeQuery = true)
    List<Object[]> findThumbnailsByProductIds(@Param("productIds") List<Long> productIds);

    List<ProductImage> findByProductId(Long productId);
    void deleteByProductId(Long productId);
}
