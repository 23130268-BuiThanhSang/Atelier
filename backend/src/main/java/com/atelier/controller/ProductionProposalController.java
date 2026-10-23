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
        return ResponseEntity.ok(proposalService.toggleProposalStatus(request, userId));
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
}