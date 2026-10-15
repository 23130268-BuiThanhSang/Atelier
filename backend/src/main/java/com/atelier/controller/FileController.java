package com.atelier.controller;

import com.atelier.file.dto.CloudinaryUploadResult;
import com.atelier.file.service.CloudinaryStorageService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final CloudinaryStorageService cloudinaryStorageService;

    @GetMapping("/health")
    public Map<String, Object> health() {
        if (cloudinaryStorageService.isConnected()) {
            return Map.of("connected", true, "service", "cloudinary");
        }
        return Map.of("connected", false, "service", "cloudinary");
    }

    @GetMapping("/cloudinary/ping")
    public Map<String, Object> ping() {
        return cloudinaryStorageService.ping();
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CloudinaryUploadResult upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false) String folder) {
        return cloudinaryStorageService.upload(file, folder);
    }
}