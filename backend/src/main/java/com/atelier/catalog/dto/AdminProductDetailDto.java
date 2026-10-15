package com.atelier.catalog.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminProductDetailDto {

    public record Response(
            Long id,
            String name,
            String slug,
            String description,
            Long categoryId,
            String categoryName,
            BigDecimal basePrice,
            String status,
            List<ImageDto> images,
            List<VariantDto> variants
    ) {}

    public record ImageDto(
            Long id,
            String imageUrl,
            boolean isThumbnail
    ) {}

    public record VariantDto(
            Long id,
            String size,
            String sku,
            int stockQuantity
    ) {}

    public record UpsertRequest(
            String name,
            String slug,
            String description,
            Long categoryId,
            BigDecimal basePrice,
            String status,
            List<String> imageUrls,
            List<VariantUpsertDto> variants
    ) {}

    public record VariantUpsertDto(
            String size,
            String sku,
            int stockQuantity
    ) {}
}