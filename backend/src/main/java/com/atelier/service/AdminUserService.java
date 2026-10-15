package com.atelier.service;

import com.atelier.repository.OrderRepository;
import com.atelier.repository.UserRepository;
import com.atelier.user.dto.AdminUserDto;
import com.atelier.user.entity.User;
import com.atelier.user.entity.UserAddress;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public AdminUserDto.MetricResponse getUserMetrics() {
        long producers = userRepository.countProducers();
        long customers = userRepository.countCustomers();
        return new AdminUserDto.MetricResponse(producers, customers);
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDto.ListItem> getUsers(String role, String status, String keyword, int page, int size) {
        String cleanRole = (role != null && !role.isBlank() && !role.equalsIgnoreCase("ALL"))
                ? role.trim().toUpperCase() : null;
        String cleanStatus = (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL"))
                ? status.trim().toUpperCase() : null;
        String cleanKeyword = (keyword != null && !keyword.isBlank())
                ? keyword.trim() : null;

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.findAdminUsers(cleanRole, cleanStatus, cleanKeyword, pageRequest);

        return userPage.map(u -> {
            long orders = 0;
            try {
                // orders = orderRepository.countByUserId(u.getId());
            } catch (Exception ignored) {}

            return new AdminUserDto.ListItem(
                    u.getId(),
                    u.getFullName() != null ? u.getFullName() : "Chưa đặt tên",
                    u.getEmail(),
                    u.getPhone(),
                    u.getAvatarUrl(),
                    extractPrimaryRole(u),
                    orders,
                    u.getStatus() != null ? u.getStatus() : "ACTIVE",
                    u.getCreatedAt()
            );
        });
    }

    @Transactional(readOnly = true)
    public AdminUserDto.Detail getUserDetail(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + id));

        long orders = 0;
        try {
            // orders = orderRepository.countByUserId(id);
        } catch (Exception ignored) {}

        return new AdminUserDto.Detail(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getPhone(),
                extractDefaultAddress(u),
                u.getAvatarUrl(),
                extractPrimaryRole(u),
                orders,
                u.getStatus() != null ? u.getStatus() : "ACTIVE",
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }

    @Transactional
    public void updateUserStatus(Long id, String newStatus) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + id));
        u.setStatus(newStatus.toUpperCase());
        userRepository.save(u);
    }

    // Helper trích xuất role chính của user
    private String extractPrimaryRole(User u) {
        if (u.getRoles() == null || u.getRoles().isEmpty()) {
            return "DESIGNER";
        }

        boolean isAdmin = u.getRoles().stream()
                .anyMatch(r -> r.getName() != null && r.getName().toUpperCase().contains("ADMIN"));
        if (isAdmin) return "ADMIN";

        boolean isProducer = u.getRoles().stream()
                .anyMatch(r -> r.getName() != null && r.getName().toUpperCase().contains("PRODUCER"));
        if (isProducer) return "PRODUCER";

        return "DESIGNER";
    }

    // Helper lấy địa chỉ mặc định (hoặc địa chỉ đầu tiên) của user
    private String extractDefaultAddress(User u) {
        if (u.getAddresses() == null || u.getAddresses().isEmpty()) {
            return "Chưa cập nhật";
        }
        return u.getAddresses().stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsDefault()))
                .findFirst()
                .map(this::formatAddress)
                .orElseGet(() -> formatAddress(u.getAddresses().get(0)));
    }

    private String formatAddress(UserAddress a) {
        if (a == null) return "Chưa cập nhật";
        // Ghép các trường địa chỉ tùy theo entity UserAddress của bạn (ví dụ: addressLine, ward, district, city)
        StringBuilder sb = new StringBuilder();
        if (a.getAddressLine() != null) sb.append(a.getAddressLine());
        return sb.length() > 0 ? sb.toString() : "Chưa cập nhật";
    }
}