package com.atelier.service;

import com.atelier.production.dto.ProducerOrderDto;
import com.atelier.production.entity.ProductionOrder;
import com.atelier.production.entity.ProductionOrderItem;
import com.atelier.repository.ProductionOrderItemRepository;
import com.atelier.repository.ProductionOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProducerOrderService {

    private final ProductionOrderRepository productionOrderRepository;
    private final ProductionOrderItemRepository productionOrderItemRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<ProducerOrderDto.ListItem> getProducerOrders(String tab) {
        String cleanTab = (tab != null && !tab.isBlank()) ? tab.trim().toLowerCase() : "all";
        List<ProductionOrder> list = productionOrderRepository.findByTab(cleanTab);
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM");

        return list.stream().map(po -> {
            int total = po.getQuantity() != null ? po.getQuantity() : 0;
            String st = po.getStatus() != null ? po.getStatus().toUpperCase() : "CONFIRMED";

            int completed = 0;
            int progress = 20;
            if ("IN_PRODUCTION".equals(st)) {
                progress = 40;
                completed = (int) (total * 0.4);
            } else if ("WAITING_PAYMENT".equals(st) || "PAID_IN_FULL".equals(st)) {
                progress = 65;
                completed = (int) (total * 0.65);
            } else if ("SHIPPED".equals(st)) {
                progress = 85;
                completed = (int) (total * 0.85);
            } else if ("DELIVERED".equals(st) || "COMPLETED".equals(st)) {
                progress = 100;
                completed = total;
            }

            String dueLabel = (po.getDeadline() != null)
                    ? "Hạn: " + po.getDeadline().format(dtf)
                    : "Hạn: 7 ngày";

            boolean isWarning = po.getDeadline() != null && po.getDeadline().isBefore(LocalDate.now().plusDays(3));

            String previewImg = getPreviewImageUrlByOrderId(po.getId());
            String title = getDesignNameByOrderId(po.getId());

            return new ProducerOrderDto.ListItem(
                    po.getId(),
                    po.getOrderCode() != null ? po.getOrderCode() : ("#TS-" + po.getId()),
                    title,
                    previewImg,
                    po.getGarmentColor(),
                    "Cotton Heavyweight 240 GSM",
                    total,
                    completed,
                    progress,
                    st,
                    po.getCurrentStage() != null ? po.getCurrentStage() : "Đã xác nhận đơn gia công",
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
        String st = po.getStatus() != null ? po.getStatus().toUpperCase() : "CONFIRMED";
        int completed = ("DELIVERED".equals(st) || "COMPLETED".equals(st)) ? total : (int) (total * 0.7);
        int progress = ("DELIVERED".equals(st) || "COMPLETED".equals(st)) ? 100 : ("SHIPPED".equals(st) ? 85 : 50);

        String title = getDesignNameByOrderId(po.getId());
        String previewImg = getPreviewImageUrlByOrderId(po.getId());

        List<ProducerOrderDto.ProgressNoteDto> progressHistory = getOrderProgressHistory(id);

        return new ProducerOrderDto.Detail(
                po.getId(),
                po.getOrderCode(),
                title,
                previewImg,
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
                progressHistory
        );
    }

    @Transactional
    public void updateProgress(Long id, ProducerOrderDto.UpdateProgressRequest req) {
        ProductionOrder po = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn sản xuất id: " + id));

        String stageLabel = po.getCurrentStage();
        if (req.status() != null && !req.status().isBlank()) {
            String newStatus = req.status().toUpperCase();
            po.setStatus(newStatus);

            if ("CONFIRMED".equals(newStatus) || "DEPOSITED".equals(newStatus)) {
                stageLabel = "Đã xác nhận";
            } else if ("IN_PRODUCTION".equals(newStatus)) {
                stageLabel = "Đang sản xuất";
            } else if ("WAITING_PAYMENT".equals(newStatus)) {
                stageLabel = "Chờ thanh toán";
            } else if ("SHIPPED".equals(newStatus)) {
                stageLabel = "Đang vận chuyển";
                // Đảm bảo đơn đã sang vận chuyển thì tiền cọc ghi nhận đủ 100%
                if (po.getTotalAmount() != null) {
                    po.setDepositAmount(po.getTotalAmount());
                }
            } else if ("DELIVERED".equals(newStatus) || "COMPLETED".equals(newStatus)) {
                stageLabel = "Đã giao hàng";
                if (po.getTotalAmount() != null) {
                    po.setDepositAmount(po.getTotalAmount());
                }
            }
            po.setCurrentStage(stageLabel);
        }

        if (req.trackingCode() != null && !req.trackingCode().isBlank()) {
            po.setTrackingCode(req.trackingCode().trim());
        }

        productionOrderRepository.save(po);

        Long creatorUserId = getOrderCreatorUserId(id);

        String noteContent = (req.notes() != null && !req.notes().isBlank())
                ? req.notes().trim()
                : ("Chuyển giai đoạn sang: " + stageLabel);

        if (req.trackingCode() != null && !req.trackingCode().isBlank()) {
            noteContent += " (Mã vận đơn: " + req.trackingCode().trim() + ")";
        }

        String safeStage = stageLabel != null && stageLabel.length() > 30 ? stageLabel.substring(0, 30) : stageLabel;

        String insertProgressSql = "INSERT INTO production_progress_updates (production_order_id, stage, note, created_by, created_at) " +
                "VALUES (?, ?, ?, ?, NOW())";
        jdbcTemplate.update(insertProgressSql, id, safeStage, noteContent, creatorUserId);
    }

    private Long getOrderCreatorUserId(Long productionOrderId) {
        if (productionOrderId == null) return 1L;
        try {
            String sqlProducerUser = """
                SELECT pp.user_id 
                FROM production_orders po
                JOIN producer_profiles pp ON po.producer_id = pp.id
                WHERE po.id = ? 
                LIMIT 1
            """;
            List<Long> list = jdbcTemplate.query(sqlProducerUser, (rs, rowNum) -> rs.getLong("user_id"), productionOrderId);
            if (!list.isEmpty() && list.get(0) != null) {
                return list.get(0);
            }

            String sqlCustomerUser = "SELECT customer_id FROM production_orders WHERE id = ? LIMIT 1";
            List<Long> customerList = jdbcTemplate.query(sqlCustomerUser, (rs, rowNum) -> rs.getLong("customer_id"), productionOrderId);
            if (!customerList.isEmpty() && customerList.get(0) != null) {
                return customerList.get(0);
            }
        } catch (Exception e) {
            log.warn("Không xác định được creator user cho đơn #{}: {}", productionOrderId, e.getMessage());
        }
        return 1L;
    }

    private String getPreviewImageUrlByOrderId(Long productionOrderId) {
        if (productionOrderId == null) return null;
        try {
            String sql = """
                SELECT dv.preview_image_url 
                FROM production_orders po
                JOIN design_versions dv ON po.design_version_id = dv.id
                WHERE po.id = ? 
                LIMIT 1
            """;
            List<String> list = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("preview_image_url"), productionOrderId);
            return list.isEmpty() ? null : list.get(0);
        } catch (Exception e) {
            log.warn("Không lấy được preview_image_url cho đơn #{}: {}", productionOrderId, e.getMessage());
            return null;
        }
    }

    private List<ProducerOrderDto.ProgressNoteDto> getOrderProgressHistory(Long productionOrderId) {
        try {
            String sql = "SELECT stage, note, created_at FROM production_progress_updates WHERE production_order_id = ? ORDER BY id DESC";
            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                Timestamp ts = rs.getTimestamp("created_at");
                return new ProducerOrderDto.ProgressNoteDto(
                        rs.getString("stage"),
                        rs.getString("note"),
                        ts != null ? ts.toLocalDateTime() : null
                );
            }, productionOrderId);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private String getDesignNameByOrderId(Long productionOrderId) {
        if (productionOrderId == null) return "Mẫu áo thiết kế";
        try {
            String sql = """
                SELECT d.name 
                FROM production_orders po
                JOIN design_versions dv ON po.design_version_id = dv.id
                JOIN designs d ON dv.design_id = d.id
                WHERE po.id = ? 
                LIMIT 1
            """;
            List<String> list = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("name"), productionOrderId);
            if (!list.isEmpty() && list.get(0) != null && !list.get(0).isBlank()) {
                return list.get(0);
            }
        } catch (Exception e) {
            log.warn("Không lấy được tên thiết kế cho đơn #{}: {}", productionOrderId, e.getMessage());
        }
        return "Mẫu áo thiết kế";
    }
}