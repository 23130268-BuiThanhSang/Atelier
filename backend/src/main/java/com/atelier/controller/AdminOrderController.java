package com.atelier.controller;

import com.atelier.order.dto.AdminOrderDto;
import com.atelier.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping("/kpis")
    public ResponseEntity<AdminOrderDto.KpiResponse> getOrderKpis() {
        return ResponseEntity.ok(adminOrderService.getOrderKpis());
    }

    @GetMapping
    public ResponseEntity<Page<AdminOrderDto.ListItem>> getOrders(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminOrderService.getOrders(status, keyword, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminOrderDto.Detail> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrderService.getOrderDetail(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(
            @PathVariable("id") Long id,
            @RequestBody AdminOrderDto.UpdateStatusRequest req
    ) {
        adminOrderService.updateOrderStatus(id, req.status());
        return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái đơn hàng thành công"));
    }
}