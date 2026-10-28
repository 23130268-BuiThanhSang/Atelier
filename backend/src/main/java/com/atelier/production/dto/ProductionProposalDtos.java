package com.atelier.production.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductionProposalDtos {

    // Request tạo / kích hoạt nhận báo giá từ Designer
    public record StartProposalRequest(
            Long designId,
            Long designVersionId,
            Long userId,
            String garmentColor,
            String printSides, // "2 Mặt" hoặc "Mặt trước"
            List<SizeQuantityDto> sizeQuantities
    ) {}

    public record SizeQuantityDto(
            String sizeLabel,
            Integer quantity
    ) {}

    // Thông tin chi tiết một Request kèm các Quotation trả về cho Designer
    public record DesignerProposalDetailResponse(
            Long requestId,
            String requestCode,
            Long designId,
            String designName,
            Long designVersionId,
            Integer versionNumber,
            String garmentColor,
            String previewImageUrl,
            String printSides,
            Integer totalQuantity,
            String status, // "DRAFT", "OPEN", "PAUSED"
            List<SizeQuantityDto> sizeBreakdown,
            List<ProducerQuotationItemResponse> quotations
    ) {}

    // Item báo giá của Producer hiển thị cho Designer
    public record ProducerQuotationItemResponse(
            Long quotationId,
            Long producerId,
            String producerName,
            String producerAvatar,
            String badge, // "ĐÃ XÁC MINH", "NGHỆ NHÂN CẤP CAO"
            Double rating,
            Integer completedOrders,
            String location,
            Integer leadTimeDays,
            BigDecimal unitPrice,
            BigDecimal totalAmount,
            String note,
            LocalDateTime createdAt
    ) {}

    // Item tóm tắt dành cho danh sách đơn cần sản xuất của Producer
    public record ProducerRequestSummaryItem(
            Long requestId,
            String requestCode,
            String designName,
            String previewImageUrl,
            String garmentColor,
            String printSides,
            Integer totalQuantity,
            String designerName,
            LocalDateTime createdAt,
            int quotationCount,
            List<SizeQuantityDto> sizeBreakdown,
            boolean hasQuoted
    ) {}

    // Producer gửi báo giá
    public record SubmitQuotationRequest(
            Long requestId,
            BigDecimal unitPrice,
            Integer leadTimeDays,
            String note
    ) {}

    // DTO tóm tắt đơn yêu cầu sản xuất dành cho Designer
    public record DesignerRequestSummaryItem(
            Long requestId,
            String requestCode,
            Long designId,
            String designName,
            String previewImageUrl,
            String garmentColor,
            String printSides,
            Integer totalQuantity,
            String status, // "OPEN", "PAUSED", "DRAFT"
            int quotationCount,
            LocalDateTime createdAt
    ) {}

    // DTO Designer gửi yêu cầu chấp thuận báo giá & đặt cọc 50%
    public record AcceptQuotationRequest(
            Long quotationId,
            Long requestId,
            Long userId,
            String shippingName,
            String shippingPhone,
            String shippingAddress
    ) {}

    // DTO phản hồi sau khi tạo đơn sản xuất thành công
    public record AcceptQuotationResponse(
            Long productionOrderId,
            String orderCode,
            BigDecimal totalAmount,
            BigDecimal depositAmount,
            String status,
            String message
    ) {}

    // DTO chi tiết tiến độ dành cho Designer theo dõi ở Bước 4
    public record DesignerProgressUpdateDto(
            String stage,
            String note,
            LocalDateTime createdAt
    ) {}

    public record DesignerProductionOrderItemDto(
            String sizeLabel,
            Integer quantity
    ) {}

    public record DesignerProductionOrderSummary(
            Long id,
            String orderCode,
            Long quotationId,
            Long designId,
            String designName,
            String previewImageUrl,
            String garmentColor,
            String printSides,
            Integer totalQuantity,
            BigDecimal unitPrice,
            BigDecimal totalAmount,
            BigDecimal depositAmount,
            BigDecimal remainingAmount,
            String status,
            String currentStage,
            LocalDateTime deadline,
            String producerName,
            String producerPhone,
            String producerAddress,
            String shippingName,
            String shippingPhone,
            String shippingAddress,
            String trackingCode,
            LocalDateTime createdAt,
            List<DesignerProductionOrderItemDto> items,
            List<DesignerProgressUpdateDto> progressHistory
    ) {}

    // DTO Designer yêu cầu thanh toán 50% còn lại (Bước 5)
    public record PayRemainingRequest(
            Long productionOrderId,
            Long userId,
            String paymentMethod // "VNPAY" | "MOMO"
    ) {}

    // DTO phản hồi sau khi thanh toán tất toán thành công
    public record PayRemainingResponse(
            Long productionOrderId,
            String orderCode,
            BigDecimal paidAmount,
            String status,
            String message
    ) {}
}