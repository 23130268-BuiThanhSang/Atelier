package com.atelier.file.service;

import com.atelier.common.config.CloudinaryProperties;
import com.atelier.common.exception.BusinessException;
import com.atelier.common.exception.ErrorCode;
import com.atelier.file.dto.CloudinaryUploadResult;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 20L * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/svg+xml"
    );

    private final CloudinaryProperties properties;

    public boolean isConnected() {
        if (!properties.isConfigured()) {
            return false;
        }
        try {
            cloudinary().api().ping(Map.of());
            return true;
        } catch (Exception ex) {
            log.warn("Cloudinary ping failed: {}", ex.getMessage());
            return false;
        }
    }

    public Map<String, Object> ping() {
        if (!properties.isConfigured()) {
            throw new BusinessException(ErrorCode.CLOUDINARY_NOT_CONFIGURED);
        }
        try {
            Map<?, ?> result = cloudinary().api().ping(Map.of());
            return Map.of(
                    "connected", true,
                    "cloudName", properties.getCloudName(),
                    "result", result
            );
        } catch (Exception ex) {
            log.error("Cloudinary ping failed", ex);
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public CloudinaryUploadResult upload(MultipartFile file, String folder) {
        if (!properties.isConfigured()) {
            throw new BusinessException(ErrorCode.CLOUDINARY_NOT_CONFIGURED);
        }
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BusinessException(ErrorCode.FILE_TOO_LARGE);
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }

        String targetFolder = (folder == null || folder.isBlank())
                ? properties.getDefaultFolder()
                : folder.trim();

        try {
            byte[] bytes = file.getBytes();
            Cloudinary cloudinary = cloudinary();
            @SuppressWarnings("unchecked")
            Map<String, Object> result = (Map<String, Object>) cloudinary.uploader().upload(bytes, ObjectUtils.asMap(
                    "folder", targetFolder,
                    "public_id", java.util.UUID.randomUUID().toString(),
                    "resource_type", "auto"
            ));

            return new CloudinaryUploadResult(
                    asString(result.get("secure_url")),
                    asString(result.get("public_id")),
                    asString(result.get("format")),
                    asLong(result.get("bytes")),
                    asInteger(result.get("width")),
                    asInteger(result.get("height")),
                    asString(result.get("resource_type"))
            );
        } catch (IOException ex) {
            log.error("Cannot read uploaded file", ex);
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        } catch (Exception ex) {
            log.error("Cloudinary upload failed", ex);
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public void delete(String publicId) {
        if (!properties.isConfigured() || publicId == null || publicId.isBlank()) {
            return;
        }
        try {
            cloudinary().uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception ex) {
            log.warn("Cloudinary delete failed for {}: {}", publicId, ex.getMessage());
        }
    }

    private Cloudinary cloudinary() {
        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", properties.getCloudName());
        config.put("api_key", properties.getApiKey());
        config.put("api_secret", properties.getApiSecret());
        config.put("secure", true);
        return new Cloudinary(config);
    }

    private static String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private static long asLong(Object value) {
        return value instanceof Number number ? number.longValue() : 0L;
    }

    private static Integer asInteger(Object value) {
        return value instanceof Number number ? number.intValue() : null;
    }
}