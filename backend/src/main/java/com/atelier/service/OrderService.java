package com.atelier.service;

import com.atelier.order.entity.Order;
import com.atelier.repository.OrderRepository;
import com.atelier.repository.UserRepository;
import com.atelier.user.entity.User;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    // Lấy danh sách đơn hàng (Dùng cho trang MyOrder.jsx)
    public List<Map<String, Object>> getOrdersByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Giả sử bạn có hàm findByUserId trong OrderRepository
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("orderCode", order.getOrderCode());
            map.put("date", order.getCreatedAt()); // Spring Boot tự parse ra chuỗi ISO
            map.put("status", order.getStatus());
            map.put("total", order.getTotalAmount());

            // TODO: Lấy tên xưởng đối tác (Tùy logic DB của bạn, có thể join với bảng Producer)
            map.put("partnerName", "Atelier Partner");

            // TODO: Tính tổng số lượng sản phẩm trong đơn hàng
            map.put("itemsCount", order.getOrderItems() != null ? order.getOrderItems().size() : 0);

            return map;
        }).collect(Collectors.toList());
    }

    // Lấy chi tiết 1 đơn hàng (Dùng cho trang OrderDetail.jsx)
    public Map<String, Object> getOrderDetailsById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        Map<String, Object> map = new HashMap<>();
        map.put("id", order.getId());
        map.put("orderCode", order.getOrderCode());
        map.put("status", order.getStatus());
        map.put("subtotal", order.getSubtotal());
        map.put("shippingFee", order.getShippingFee());
        map.put("totalAmount", order.getTotalAmount());
        map.put("shippingName", order.getShippingName());
        map.put("shippingPhone", order.getShippingPhone());
        map.put("shippingAddress", order.getShippingAddress());
        map.put("createdAt", order.getCreatedAt());
        map.put("partnerName", "Atelier Partner");

        if (order.getOrderItems() != null) {
            List<Map<String, Object>> items = order.getOrderItems().stream().map(item -> {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("name", item.getProductName());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("price", item.getUnitPrice());
                itemMap.put("total", item.getSubtotal());
                itemMap.put("image", "https://placehold.co/100x100/f6eed2/f0592a?text=Item");
                return itemMap;
            }).collect(Collectors.toList());
            map.put("items", items);
        } else {
            map.put("items", new ArrayList<>());
        }

        return map;
    }
}
