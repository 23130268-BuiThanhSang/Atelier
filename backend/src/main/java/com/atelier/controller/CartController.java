package com.atelier.controller;

import com.atelier.cart.dto.AddToCartRequest;
import com.atelier.cart.dto.CartResponse;
import com.atelier.cart.dto.UpdateCartItemRequest;
import com.atelier.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Lấy giỏ hàng của người dùng (theo header X-User-ID).
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart(@RequestHeader("X-User-ID") Long userId) {
        CartResponse cart = cartService.getCart(userId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Thêm sản phẩm vào giỏ hàng.
     */
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody @Valid AddToCartRequest request) {
        CartResponse cart = cartService.addItem(userId, request);
        return ResponseEntity.created(URI.create("/api/v1/cart")).body(cart);
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     */
    @PutMapping("/items/{variantId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Long variantId,
            @RequestBody @Valid UpdateCartItemRequest request) {
        CartResponse cart = cartService.updateQuantity(userId, variantId, request);
        return ResponseEntity.ok(cart);
    }

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     */
    @DeleteMapping("/items/{variantId}")
    public ResponseEntity<CartResponse> removeItem(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Long variantId) {
        CartResponse cart = cartService.removeItem(userId, variantId);
        return ResponseEntity.ok(cart);
    }
}
