package com.atelier.service;

import com.atelier.cart.entity.Cart;
import com.atelier.cart.entity.CartItem;
import com.atelier.cart.repository.CartItemRepository;
import com.atelier.cart.repository.CartRepository;
import com.atelier.catalog.entity.ProductImage;
import com.atelier.catalog.entity.ProductVariant;
import com.atelier.common.exception.BusinessException;
import com.atelier.common.exception.ErrorCode;
import com.atelier.order.dto.CreateOrderRequest;
import com.atelier.order.entity.Order;
import com.atelier.order.entity.OrderItem;
import com.atelier.repository.OrderItemRepository;
import com.atelier.repository.OrderRepository;
import com.atelier.repository.ProductImageRepository;
import com.atelier.repository.ProductVariantRepository;
import com.atelier.repository.UserRepository;
import com.atelier.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;

    /**
     * Tạo đơn hàng mới từ các sản phẩm được tích chọn trong giỏ hàng.
     */
    @Transactional
    public Map<String, Object> createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_NOT_FOUND));

        List<CartItem> allItems = cartItemRepository.findByCartIdWithVariant(cart.getId());
        if (allItems.isEmpty()) {
            throw new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        // Lọc các món hàng theo danh sách variantId được tích chọn (nếu có)
        List<CartItem> selectedItems;
        if (request.getSelectedVariantIds() != null && !request.getSelectedVariantIds().isEmpty()) {
            Set<Long> selectedSet = new HashSet<>(request.getSelectedVariantIds());
            selectedItems = allItems.stream()
                    .filter(item -> selectedSet.contains(item.getProductVariant().getId()))
                    .collect(Collectors.toList());
        } else {
            selectedItems = allItems;
        }

        if (selectedItems.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn ít nhất một sản phẩm trong giỏ để đặt hàng.");
        }

        // Kiểm tra số lượng tồn kho
        for (CartItem item : selectedItems) {
            ProductVariant variant = item.getProductVariant();
            if (variant.getStockQuantity() == null || variant.getStockQuantity() < item.getQuantity()) {
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
            }
        }

        // Tính tiền hàng (subtotal)
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : selectedItems) {
            BigDecimal price = item.getProductVariant().getPrice() != null
                    ? item.getProductVariant().getPrice()
                    : BigDecimal.ZERO;
            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }

        // Tính phí vận chuyển (miễn phí từ 500k, ngược lại 30k)
        BigDecimal freeShippingThreshold = new BigDecimal("500000");
        BigDecimal shippingFee = (subtotal.compareTo(freeShippingThreshold) >= 0)
                ? BigDecimal.ZERO
                : new BigDecimal("30000");
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount);

        // Sinh mã đơn hàng duy nhất dạng ORD-YYMMDD-XXXX
        String datePart = DateTimeFormatter.ofPattern("yyMMdd").format(LocalDate.now());
        String orderCode;
        do {
            int randomPart = (int) (Math.random() * 9000) + 1000;
            orderCode = "ORD-" + datePart + "-" + randomPart;
        } while (orderRepository.existsByOrderCode(orderCode));

        // Ghép ghi chú vào địa chỉ (nếu có)
        String fullAddress = request.getShippingAddress().trim();
        if (request.getNote() != null && !request.getNote().trim().isEmpty()) {
            fullAddress += " (Ghi chú: " + request.getNote().trim() + ")";
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderCode(orderCode);
        order.setStatus("PENDING");
        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);
        order.setShippingName(request.getShippingName().trim());
        order.setShippingPhone(request.getShippingPhone().trim());
        order.setShippingAddress(fullAddress);

        Order savedOrder = orderRepository.save(order);

        // Lưu từng mục hàng vào order_items và trừ tồn kho
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : selectedItems) {
            ProductVariant variant = item.getProductVariant();
            String prodName = (variant.getProduct() != null && variant.getProduct().getName() != null)
                    ? variant.getProduct().getName()
                    : "Sản phẩm";
            String sku = variant.getSku() != null ? variant.getSku() : ("VAR-" + variant.getId());
            BigDecimal unitPrice = variant.getPrice() != null ? variant.getPrice() : BigDecimal.ZERO;
            BigDecimal itemSubtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .productVariant(variant)
                    .productName(prodName)
                    .sku(sku)
                    .unitPrice(unitPrice)
                    .quantity(item.getQuantity())
                    .subtotal(itemSubtotal)
                    .build();
            orderItems.add(orderItem);

            // Cập nhật tồn kho biến thể
            if (variant.getStockQuantity() != null) {
                variant.setStockQuantity(Math.max(0, variant.getStockQuantity() - item.getQuantity()));
                productVariantRepository.save(variant);
            }
        }
        orderItemRepository.saveAll(orderItems);

        // Chỉ xóa các món đã được đặt khỏi giỏ hàng (các món không chọn vẫn được giữ lại)
        cartItemRepository.deleteAll(selectedItems);

        Map<String, Object> result = new HashMap<>();
        result.put("id", savedOrder.getId());
        result.put("orderCode", savedOrder.getOrderCode());
        result.put("status", savedOrder.getStatus());
        result.put("subtotal", savedOrder.getSubtotal());
        result.put("shippingFee", savedOrder.getShippingFee());
        result.put("totalAmount", savedOrder.getTotalAmount());
        result.put("shippingName", savedOrder.getShippingName());
        result.put("shippingPhone", savedOrder.getShippingPhone());
        result.put("shippingAddress", savedOrder.getShippingAddress());
        result.put("createdAt", savedOrder.getCreatedAt());
        result.put("message", "Đặt hàng thành công!");

        return result;
    }

    // Lấy danh sách đơn hàng (Dùng cho trang MyOrders.jsx)
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getOrdersByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("orderCode", order.getOrderCode());
            map.put("date", order.getCreatedAt());
            map.put("status", order.getStatus());
            map.put("total", order.getTotalAmount());
            map.put("partnerName", "Atelier Partner");

            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            map.put("itemsCount", items != null ? items.size() : 0);

            return map;
        }).collect(Collectors.toList());
    }

    // Lấy chi tiết 1 đơn hàng (Dùng cho trang OrderDetail.jsx)
    @Transactional(readOnly = true)
    public Map<String, Object> getOrderDetailsById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        Map<String, Object> map = new HashMap<>();
        map.put("id", order.getId());
        map.put("orderCode", order.getOrderCode());
        map.put("status", order.getStatus());
        map.put("subtotal", order.getSubtotal());
        map.put("shippingFee", order.getShippingFee());
        map.put("totalAmount", order.getTotalAmount());
        map.put("shippingName", order.getShippingName());
        map.put("shippingPhone", order.getShippingPhone());
        map.put("shippingAddress", order.getShippingAddress());
        map.put("createdAt", order.getCreatedAt());
        map.put("partnerName", "Atelier Partner");

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        if (items != null && !items.isEmpty()) {
            List<Map<String, Object>> itemMaps = items.stream().map(item -> {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("name", item.getProductName());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("price", item.getUnitPrice());
                itemMap.put("total", item.getSubtotal());
                itemMap.put("sku", item.getSku());

                String img = "https://placehold.co/100x100/f6eed2/f0592a?text=Item";
                try {
                    if (item.getProductVariant() != null && item.getProductVariant().getProduct() != null) {
                        Long pId = item.getProductVariant().getProduct().getId();
                        List<ProductImage> images = productImageRepository.findCatalogImages(List.of(pId));
                        if (!images.isEmpty() && images.get(0).getImageUrl() != null) {
                            img = images.get(0).getImageUrl();
                        }
                    }
                } catch (Exception ignored) {}
                itemMap.put("image", img);

                return itemMap;
            }).collect(Collectors.toList());
            map.put("items", itemMaps);
        } else {
            map.put("items", new ArrayList<>());
        }

        return map;
    }
}
