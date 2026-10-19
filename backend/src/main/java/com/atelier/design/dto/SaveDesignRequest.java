package com.atelier.design.dto;

import java.util.List;

public record SaveDesignRequest(
        Long designId, // null nếu tạo mới, có giá trị nếu đang chỉnh sửa thiết kế cũ
        String name,
        Long garmentId,
        String garmentColor,
        String previewImageUrl,
        List<ElementDto> elements
) {
    public record ElementDto(
            String side,
            String elementType,
            String textContent,
            String imageUrl, // Lưu URL hoặc Base64 của layer ảnh để load lại khi Chỉnh sửa
            Double positionX,
            Double positionY,
            Double width,
            Double height,
            Double rotation,
            String color,
            Integer fontSize,
            String fontFamily,
            String fontWeight
    ) {}
}
