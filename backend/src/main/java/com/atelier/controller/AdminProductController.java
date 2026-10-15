package com.atelier.controller;

import com.atelier.catalog.dto.AdminProductSummaryResponse;
import com.atelier.catalog.dto.AdminProductSummaryResponse.BulkStatusRequest;
import com.atelier.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    public ResponseEntity<AdminProductSummaryResponse> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size
    ) {
        return ResponseEntity.ok(adminProductService.getAdminProducts(keyword, status, page, size));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Map<String, String>> toggleStatus(@PathVariable Long id) {
        adminProductService.toggleProductStatus(id);
        return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công"));
    }

    @PostMapping("/bulk-status")
    public ResponseEntity<Map<String, String>> bulkStatus(@RequestBody BulkStatusRequest request) {
        adminProductService.bulkUpdateStatus(request.productIds(), request.targetStatus());
        return ResponseEntity.ok(Map.of("message", "Thao tác hàng loạt thành công"));
    }
}