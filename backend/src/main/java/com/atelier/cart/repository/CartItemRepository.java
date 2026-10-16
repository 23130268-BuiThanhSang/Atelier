package com.atelier.cart.repository;

import com.atelier.cart.entity.CartItem;
import com.atelier.catalog.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndProductVariantId(Long cartId, Long productVariantId);

    List<CartItem> findByCartId(Long cartId);

    @Query("""
        SELECT ci FROM CartItem ci
        JOIN FETCH ci.productVariant pv
        JOIN FETCH pv.product p
        WHERE ci.cart.id = :cartId
        ORDER BY ci.id ASC
        """)
    List<CartItem> findByCartIdWithVariant(@Param("cartId") Long cartId);

    boolean existsByCartIdAndProductVariantId(Long cartId, Long productVariantId);

    @Transactional
    @Modifying
    @Query("""
        DELETE FROM CartItem ci
        WHERE ci.cart.id = :cartId
          AND ci.productVariant.id = :variantId
        """)
    void deleteByCartIdAndProductVariantId(@Param("cartId") Long cartId, @Param("variantId") Long variantId);
}
