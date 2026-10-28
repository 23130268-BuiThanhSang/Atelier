package com.atelier.production.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProducerOrderDto {

    public record ListItem(
            Long id,
            String orderCode,
            String title,
            String previewImageUrl,
            String garmentColor,
            String spec,
            int totalUnits,
            int completedUnits,
            int progressPercent,
            String status,
            String currentStage,
            LocalDate deadline,
            String dueDateLabel,
            boolean isWarning
    ) {}

    public record Detail(
            Long id,
            String orderCode,
            String title,
            String previewImageUrl,
            String garmentColor,
            String spec,
            String printSides,
            int totalUnits,
            int completedUnits,
            int progressPercent,
            BigDecimal unitPrice,
            BigDecimal totalAmount,
            BigDecimal depositAmount,
            String status,
            String currentStage,
            LocalDate deadline,
            String shippingName,
            String shippingPhone,
            String shippingAddress,
            String trackingCode,
            LocalDateTime createdAt,
            List<ItemSizeDto> items,
            List<ProgressNoteDto> progressHistory
    ) {}

    public record ItemSizeDto(
            Long id,
            String sizeLabel,
            int quantity
    ) {}

    public record ProgressNoteDto(
            String stage,
            String note,
            LocalDateTime createdAt
    ) {}

    public record UpdateProgressRequest(
            String status,
            Integer completedUnits,
            String notes,
            String trackingCode
    ) {}
}