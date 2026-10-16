package com.atelier.service;

import com.atelier.order.dto.AdminOrderDto;
import com.atelier.order.entity.Order;
import com.atelier.order.entity.OrderItem;
import com.atelier.repository.OrderItemRepository;
import com.atelier.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional(readOnly = true)
    public AdminOrderDto.KpiResponse getOrderKpis() {
        long total = orderRepository.count();
        long inProd = orderRepository.countInProduction();
        long pendingDel = orderRepository.countPendingDelivery();
        long disputed = orderRepository.countByStatus("DISPUTED");

        return new AdminOrderDto.KpiResponse(total, inProd, pendingDel, disputed);
    }

    @Transactional(readOnly = true)
    public Page<AdminOrderDto.ListItem> getOrders(String status, String keyword, int page, int size) {
        // Nếu status rỗng hoặc là ALL thì đặt là null để bỏ qua điều kiện lọc
        String cleanStatus = (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL"))
                ? status.trim().toUpperCase()
                : null;

        String cleanKeyword = (keyword != null && !keyword.isBlank())
                ? keyword.trim()
                : null;

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findAdminOrders(cleanStatus, cleanKeyword, pageRequest);

        return orderPage.map(o -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(o.getId());
            String prodName = "Đơn hàng";
            int itemCount = 0;

            if (items != null && !items.isEmpty()) {
                itemCount = items.size();
                prodName = items.get(0).getProductName() != null ? items.get(0).getProductName() : "Đơn hàng";
            }

            return new AdminOrderDto.ListItem(
                    o.getId(),
                    o.getOrderCode(),
                    o.getShippingName() != null ? o.getShippingName() : "Khách vãng lai",
                    o.getShippingPhone(),
                    o.getShippingAddress(),
                    prodName,
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80",
                    itemCount,
                    o.getTotalAmount(),
                    o.getStatus(),
                    o.getCreatedAt()
            );
        });
    }

    @Transactional(readOnly = true)
    public AdminOrderDto.Detail getOrderDetail(Long id) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng id: " + id));

        // Lấy danh sách item thực tế của đơn hàng từ bảng order_items
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(id);

        List<AdminOrderDto.OrderItemDto> items = orderItems.stream().map(it -> {
            String pName = it.getProductName() != null ? it.getProductName() : "Sản phẩm";
            String sku = it.getSku() != null ? it.getSku() : "";
            int qty = it.getQuantity() != null ? it.getQuantity() : 1;
            BigDecimal price = it.getUnitPrice() != null ? it.getUnitPrice() : BigDecimal.ZERO;
            String demoImg = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80";

            return new AdminOrderDto.OrderItemDto(
                    it.getId(),
                    pName,
                    demoImg,
                    sku,      // Hiển thị mã SKU hoặc Size từ SKU
                    "Default",
                    qty,
                    price
            );
        }).toList();

        return new AdminOrderDto.Detail(
                o.getId(),
                o.getOrderCode(),
                o.getShippingName(),
                o.getShippingPhone(),
                o.getShippingAddress(),
                o.getSubtotal(),
                o.getShippingFee(),
                o.getDiscountAmount(),
                o.getTotalAmount(),
                o.getStatus(),
                o.getCreatedAt(),
                o.getUpdatedAt(),
                items
        );
    }

    @Transactional
    public void updateOrderStatus(Long id, String newStatus) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng id: " + id));
        o.setStatus(newStatus.toUpperCase());
        orderRepository.save(o);
    }
}