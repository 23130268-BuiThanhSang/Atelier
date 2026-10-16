package com.atelier.controller;

import com.atelier.catalog.dto.AdminProductDetailDto;
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

    @GetMapping("/{id}")
    public ResponseEntity<AdminProductDetailDto.Response> getProductDetail(@PathVariable("id") Long id) {
        return ResponseEntity.ok(adminProductService.getProductDetail(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody AdminProductDetailDto.UpsertRequest req) {
        Long createdId = adminProductService.createProduct(req);
        return ResponseEntity.ok(Map.of("message", "Tạo sản phẩm thành công", "id", createdId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateProduct(
            @PathVariable("id") Long id,
            @RequestBody AdminProductDetailDto.UpsertRequest req
    ) {
        adminProductService.updateProduct(id, req);
        return ResponseEntity.ok(Map.of("message", "Cập nhật sản phẩm thành công"));
    }
}