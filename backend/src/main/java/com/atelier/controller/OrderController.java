package com.atelier.controller;

import com.atelier.order.dto.CreateOrderRequest;
import com.atelier.order.entity.Order;
import com.atelier.repository.OrderRepository;
import com.atelier.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/orders", "/api/v1/orders"})
@CrossOrigin("*") // Cho phép React gọi API
public class OrderController {

    private final OrderService orderService;
    @Autowired
    private OrderRepository orderRepository;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // API: Tạo đơn hàng mới từ giỏ hàng
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestHeader(value = "X-User-ID", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @Valid @RequestBody CreateOrderRequest request) {
        try {
            Long userId = headerUserId != null ? headerUserId : paramUserId;
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Vui lòng đăng nhập để thực hiện đặt hàng."));
            }
            Map<String, Object> order = orderService.createOrder(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 1. API: Lấy danh sách đơn hàng theo Email
    @GetMapping("/user")
    public ResponseEntity<?> getMyOrders(@RequestParam String email) {
        try {
            List<Map<String, Object>> orders = orderService.getOrdersByUserEmail(email);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 2. API: Lấy chi tiết một đơn hàng theo ID (hoặc Order Code)
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        try {
            Map<String, Object> orderDetail = orderService.getOrderDetailsById(id);
            return ResponseEntity.ok(orderDetail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Chỉ có thể hủy đơn hàng đang chờ xác nhận"));
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        return ResponseEntity.ok(Map.of("message", "Hủy đơn hàng thành công"));
    }
}
