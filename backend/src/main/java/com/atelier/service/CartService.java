package com.atelier.service;

import com.atelier.cart.dto.AddToCartRequest;
import com.atelier.cart.dto.CartItemResponse;
import com.atelier.cart.dto.CartResponse;
import com.atelier.cart.dto.UpdateCartItemRequest;
import com.atelier.cart.entity.Cart;
import com.atelier.cart.entity.CartItem;
import com.atelier.cart.repository.CartItemRepository;
import com.atelier.cart.repository.CartRepository;
import com.atelier.catalog.entity.ProductVariant;
import com.atelier.catalog.entity.ProductImage;
import com.atelier.repository.ProductImageRepository;
import com.atelier.repository.ProductVariantRepository;
import com.atelier.common.exception.BusinessException;
import com.atelier.common.exception.ErrorCode;
import com.atelier.user.entity.User;
import com.atelier.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;

    /**
     * Lấy giỏ hàng của người dùng. Nếu chưa có thì tạo giỏ trống mới.
     */
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        User user = getUser(userId);
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> createCart(user));

        List<CartItem> items = cartItemRepository.findByCartIdWithVariant(cart.getId());
        List<CartItemResponse> itemResponses = items.stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer itemCount = itemResponses.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        return new CartResponse(userId, itemResponses, itemCount, subtotal);
    }

    /**
     * Thêm sản phẩm vào giỏ hàng (hoặc cộng dồn số lượng nếu biến thể đã có trong giỏ).
     */
    @Transactional
    public CartResponse addItem(Long userId, @Valid AddToCartRequest request) {
        User user = getUser(userId);
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

        int requestedQty = request.getQuantity() == null ? 1 : request.getQuantity();
        if (variant.getStockQuantity() == null || variant.getStockQuantity() < requestedQty) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> createCart(user));

        CartItem existing = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                .orElse(null);

        if (existing != null) {
            int newQuantity = existing.getQuantity() + requestedQty;
            if (variant.getStockQuantity() < newQuantity) {
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
            }
            existing.setQuantity(newQuantity);
            cartItemRepository.save(existing);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProductVariant(variant);
            item.setQuantity(requestedQty);
            cartItemRepository.save(item);
        }

        return getCart(userId);
    }

    /**
     * Cập nhật số lượng một mặt hàng trong giỏ.
     */
    @Transactional
    public CartResponse updateQuantity(Long userId, Long variantId, @Valid UpdateCartItemRequest request) {
        User user = getUser(userId);
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_NOT_FOUND));

        CartItem item = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));

        int newQty = request.getQuantity() == null ? 1 : request.getQuantity();
        if (variant.getStockQuantity() == null || variant.getStockQuantity() < newQty) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
        }

        item.setQuantity(newQty);
        cartItemRepository.save(item);

        return getCart(userId);
    }

    /**
     * Xóa một mặt hàng khỏi giỏ hàng.
     */
    @Transactional
    public CartResponse removeItem(Long userId, Long variantId) {
        User user = getUser(userId);

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_NOT_FOUND));

        boolean exists = cartItemRepository.existsByCartIdAndProductVariantId(cart.getId(), variantId);
        if (!exists) {
            throw new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        cartItemRepository.deleteByCartIdAndProductVariantId(cart.getId(), variantId);

        return getCart(userId);
    }

    /* ===================== Private helpers ===================== */

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_NOT_FOUND));
    }

    private Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        ProductVariant variant = item.getProductVariant();
        BigDecimal price = variant.getPrice() == null ? BigDecimal.ZERO : variant.getPrice();
        BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

        // Lấy ảnh đại diện đầu tiên của sản phẩm
        String imageUrl = productImageRepository.findProductImages(variant.getProduct().getId()).stream()
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(null);

        return new CartItemResponse(
                item.getId(),
                variant.getId(),
                variant.getProduct().getId(),
                variant.getProduct().getName(),
                imageUrl,
                variant.getSize(),
                variant.getColor(),
                price,
                item.getQuantity(),
                variant.getStockQuantity() == null ? 0 : variant.getStockQuantity(),
                lineTotal
        );
    }
}
