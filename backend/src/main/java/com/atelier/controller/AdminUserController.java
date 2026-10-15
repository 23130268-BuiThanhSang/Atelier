package com.atelier.controller;

import com.atelier.service.AdminUserService;
import com.atelier.user.dto.AdminUserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/metrics")
    public ResponseEntity<AdminUserDto.MetricResponse> getUserMetrics() {
        return ResponseEntity.ok(adminUserService.getUserMetrics());
    }

    @GetMapping
    public ResponseEntity<Page<AdminUserDto.ListItem>> getUsers(
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminUserService.getUsers(role, status, keyword, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserDto.Detail> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.getUserDetail(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody AdminUserDto.UpdateStatusRequest req
    ) {
        adminUserService.updateUserStatus(id, req.status());
        return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái người dùng thành công"));
    }
}