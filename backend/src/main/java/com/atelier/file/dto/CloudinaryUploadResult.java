package com.atelier.file.dto;

public record CloudinaryUploadResult(
        String secureUrl,
        String publicId,
        String format,
        long bytes,
        Integer width,
        Integer height,
        String resourceType
) {
}