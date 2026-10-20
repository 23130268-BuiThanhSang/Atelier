package com.atelier.controller;

import com.atelier.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/upload")
@RequiredArgsConstructor
public class AdminUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadImage(@RequestBody Map<String, String> payload) {
        String base64Data = payload.get("image");
        if (base64Data == null || base64Data.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ảnh không hợp lệ"));
        }

        try {
            // Đặt trong try-catch để bắt IOException mà uploadBase64 có thể ném ra
            String imageUrl = cloudinaryService.uploadBase64(base64Data, "products");
            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (Exception e) {
            log.error("Lỗi khi upload ảnh sản phẩm lên Cloudinary: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể tải ảnh lên Cloudinary: " + e.getMessage()));
        }
    }
}