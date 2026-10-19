package com.atelier.design.dto;

import java.math.BigDecimal;
import java.util.List;

public class DesignSaveDto {

    public record Request(
            Long designId,
            String name,
            Long garmentId,
            String garmentColor,
            String previewImageUrl, // Chuỗi Data URL (Base64) xuất từ Canvas
            List<ElementItem> elements
    ) {}

    public record ElementItem(
            String side,
            String elementType,
            String textContent,
            BigDecimal positionX,
            BigDecimal positionY,
            BigDecimal width,
            BigDecimal height,
            BigDecimal rotation,
            String color,
            BigDecimal fontSize,
            String fontFamily
    ) {}

    public record Response(
            Long designId,
            Long versionId,
            Integer versionNumber,
            String previewImageUrl,
            String message
    ) {}
}