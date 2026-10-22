package com.atelier.controller;

import com.atelier.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*") // Cho phép React gọi API
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. API: Lấy danh sách đơn hàng theo Email
    @GetMapping("/user")
    public ResponseEntity<?> getMyOrders(@RequestParam String email) {
        try {
            // Lấy danh sách tóm tắt (List)
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
            // Lấy chi tiết 1 đơn hàng (Object) kèm theo danh sách Items
            Map<String, Object> orderDetail = orderService.getOrderDetailsById(id);
            return ResponseEntity.ok(orderDetail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
