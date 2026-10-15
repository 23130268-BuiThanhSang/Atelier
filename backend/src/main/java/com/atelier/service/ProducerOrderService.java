package com.atelier.service;

import com.atelier.production.dto.ProducerOrderDto;
import com.atelier.production.entity.ProductionOrder;
import com.atelier.production.entity.ProductionOrderItem;
import com.atelier.repository.ProductionOrderItemRepository;
import com.atelier.repository.ProductionOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProducerOrderService {

    private final ProductionOrderRepository productionOrderRepository;
    private final ProductionOrderItemRepository productionOrderItemRepository;

    @Transactional(readOnly = true)
    public List<ProducerOrderDto.ListItem> getProducerOrders(String tab) {
        String cleanTab = (tab != null && !tab.isBlank()) ? tab.trim().toLowerCase() : "all";
        List<ProductionOrder> list = productionOrderRepository.findByTab(cleanTab);
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM");

        return list.stream().map(po -> {
            int total = po.getQuantity() != null ? po.getQuantity() : 0;
            String st = po.getStatus() != null ? po.getStatus().toUpperCase() : "PENDING";

            int completed = 0;
            int progress = 10;
            if ("IN_PRODUCTION".equals(st)) {
                progress = 65;
                completed = (int) (total * 0.65);
            } else if ("QC_INSPECTION".equals(st)) {
                progress = 85;
                completed = (int) (total * 0.85);
            } else if ("SHIPPED".equals(st) || "COMPLETED".equals(st)) {
                progress = 100;
                completed = total;
            }

            String dueLabel = (po.getDeadline() != null)
                    ? "Hạn: " + po.getDeadline().format(dtf)
                    : "Hạn: 7 ngày";

            boolean isWarning = "QC_INSPECTION".equals(st) || (po.getDeadline() != null && po.getDeadline().isBefore(LocalDate.now().plusDays(3)));

            String title = "Áo thun " + (po.getGarmentColor() != null ? po.getGarmentColor() : "Custom Tee");

            return new ProducerOrderDto.ListItem(
                    po.getId(),
                    po.getOrderCode() != null ? po.getOrderCode() : ("#TS-" + po.getId()),
                    title,
                    po.getGarmentColor(),
                    "Cotton Heavyweight 240 GSM",
                    total,
                    completed,
                    progress,
                    st,
                    po.getCurrentStage() != null ? po.getCurrentStage() : "Chuẩn bị rập & in",
                    po.getDeadline(),
                    dueLabel,
                    isWarning
            );
        }).toList();
    }

    @Transactional(readOnly = true)
    public ProducerOrderDto.Detail getOrderDetail(Long id) {
        ProductionOrder po = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn sản xuất id: " + id));

        List<ProductionOrderItem> items = productionOrderItemRepository.findByProductionOrderId(id);

        List<ProducerOrderDto.ItemSizeDto> itemDtos = items.stream()
                .map(it -> new ProducerOrderDto.ItemSizeDto(
                        it.getId(),
                        it.getSizeLabel(),
                        it.getQuantity() != null ? it.getQuantity() : 0
                )).toList();

        int total = po.getQuantity() != null ? po.getQuantity() : 0;
        String st = po.getStatus() != null ? po.getStatus().toUpperCase() : "PENDING";
        int completed = "COMPLETED".equals(st) ? total : (int) (total * 0.7);
        int progress = "COMPLETED".equals(st) ? 100 : 70;

        String title = "Áo thun " + (po.getGarmentColor() != null ? po.getGarmentColor() : "Custom");

        return new ProducerOrderDto.Detail(
                po.getId(),
                po.getOrderCode(),
                title,
                po.getGarmentColor(),
                "Cotton Heavyweight 240 GSM",
                po.getPrintSides() != null ? po.getPrintSides() : "Mặt trước",
                total,
                completed,
                progress,
                po.getUnitPrice(),
                po.getTotalAmount(),
                po.getDepositAmount(),
                st,
                po.getCurrentStage(),
                po.getDeadline(),
                po.getShippingName(),
                po.getShippingPhone(),
                po.getShippingAddress(),
                po.getTrackingCode(),
                po.getCreatedAt(),
                itemDtos,
                Collections.emptyList()
        );
    }

    @Transactional
    public void updateProgress(Long id, ProducerOrderDto.UpdateProgressRequest req) {
        ProductionOrder po = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn sản xuất id: " + id));

        if (req.status() != null && !req.status().isBlank()) {
            po.setStatus(req.status().toUpperCase());
            if ("IN_PRODUCTION".equalsIgnoreCase(req.status())) {
                po.setCurrentStage("In ấn & Sấy hầm nhiệt");
            } else if ("QC_INSPECTION".equalsIgnoreCase(req.status())) {
                po.setCurrentStage("Kiểm tra QC");
            } else if ("SHIPPED".equalsIgnoreCase(req.status())) {
                po.setCurrentStage("Vận chuyển");
            } else if ("COMPLETED".equalsIgnoreCase(req.status())) {
                po.setCurrentStage("Hoàn tất");
            }
        }

        productionOrderRepository.save(po);
    }
}