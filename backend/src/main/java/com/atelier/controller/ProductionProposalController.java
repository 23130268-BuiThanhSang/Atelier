package com.atelier.controller;

import com.atelier.production.dto.ProductionProposalDtos.*;
import com.atelier.service.ProductionProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/proposals")
@RequiredArgsConstructor
public class ProductionProposalController {

    private final ProductionProposalService proposalService;

    // 1. Designer xem trang báo giá của mẫu thiết kế
    @GetMapping("/design/{designId}")
    public ResponseEntity<DesignerProposalDetailResponse> getProposalDetail(
            @PathVariable Long designId,
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.ok(proposalService.getProposalDetailForDesigner(designId, userId));
    }

    // 2. Designer bấm "Bắt đầu nhận giá" hoặc "Tạm ngưng nhận giá"
    @PostMapping("/toggle-status")
    public ResponseEntity<DesignerProposalDetailResponse> toggleProposalStatus(
            @RequestBody StartProposalRequest request,
            @RequestParam(required = false) Long userId
    ) {
        Long actualUserId = (request.userId() != null && request.userId() > 0) ? request.userId() : userId;
        return ResponseEntity.ok(proposalService.toggleProposalStatus(request, actualUserId));
    }

    // 3. Producer xem các đơn thiết kế đang mở nhận báo giá (OPEN)
    @GetMapping("/producer/open-requests")
    public ResponseEntity<List<ProducerRequestSummaryItem>> getOpenRequests(
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.ok(proposalService.getOpenRequestsForProducers(userId));
    }

    // 4. Producer gửi báo giá
    @PostMapping("/producer/quote")
    public ResponseEntity<Void> submitQuotation(
            @RequestBody SubmitQuotationRequest request,
            @RequestParam(required = false) Long userId
    ) {
        proposalService.submitQuotation(request, userId);
        return ResponseEntity.ok().build();
    }

    // 5. Designer xem danh sách các đơn yêu cầu sản xuất của mình
    @GetMapping("/my-requests")
    public ResponseEntity<List<DesignerRequestSummaryItem>> getMyProductionRequests(
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.ok(proposalService.getMyProductionRequests(userId));
    }

    // 6. Designer chấp thuận báo giá và xác nhận đặt cọc 50%
    @PostMapping("/accept-and-deposit")
    public ResponseEntity<AcceptQuotationResponse> acceptAndDeposit(
            @RequestBody AcceptQuotationRequest request,
            @RequestParam(required = false) Long userId
    ) {
        Long actualUserId = (request.userId() != null && request.userId() > 0) ? request.userId() : userId;
        return ResponseEntity.ok(proposalService.acceptQuotationAndDeposit(request, actualUserId));
    }

    // 7. Designer xem danh sách các đơn đặt may gia công của mình (Bước 4)
    @GetMapping("/my-production-orders")
    public ResponseEntity<List<DesignerProductionOrderSummary>> getMyProductionOrders(
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.ok(proposalService.getMyProductionOrders(userId));
    }

    // 8. Designer thanh toán 50% còn lại (Bước 5)
    @PostMapping("/pay-remaining")
    public ResponseEntity<PayRemainingResponse> payRemaining(
            @RequestBody PayRemainingRequest request,
            @RequestParam(required = false) Long userId
    ) {
        Long actualUserId = (request.userId() != null && request.userId() > 0) ? request.userId() : userId;
        return ResponseEntity.ok(proposalService.payRemainingAmount(request, actualUserId));
    }
}