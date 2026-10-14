package com.atelier.controller;

import com.atelier.user.dto.ProfileDto;
import com.atelier.production.entity.ProducerProfile;
import com.atelier.repository.ProducerProfileRepository;
import com.atelier.repository.UserRepository;
import com.atelier.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final ProducerProfileRepository producerProfileRepository;

    // LẤY THÔNG TIN HỒ SƠ
    @GetMapping
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        ProfileDto dto = new ProfileDto();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setStatus(user.getStatus());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setCreatedAt(user.getCreatedAt().toString());
        dto.setRole(user.getRoles().iterator().next().getName()); // PRODUCER hoặc DESIGNER

        // Nếu là Producer, nhét thêm data của Producer vào
        if (dto.getRole().equalsIgnoreCase("PRODUCER")) {
            producerProfileRepository.findByUser(user).ifPresent(p -> {
                dto.setBusinessName(p.getBusinessName());
                dto.setDescription(p.getDescription());
                dto.setAddress(p.getAddress());
                dto.setProvince(p.getProvince());
                dto.setMoq(p.getMoq());
                dto.setMonthlyCapacity(p.getMonthlyCapacity());
                dto.setLeadTimeDays(p.getLeadTimeDays());
                dto.setPriceMin(p.getPriceMin());
                dto.setPriceMax(p.getPriceMax());
                dto.setIsAcceptingOrders(p.getIsAcceptingOrders());
            });
        }
        return ResponseEntity.ok(dto);
    }

    // LƯU CẬP NHẬT HỒ SƠ
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestParam String email, @RequestBody ProfileDto request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // 1. Cập nhật bảng users
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        userRepository.save(user);

        // 2. Cập nhật bảng producer_profile (Nếu là Producer)
        String roleName = user.getRoles().iterator().next().getName();
        if (roleName.equalsIgnoreCase("PRODUCER")) {
            ProducerProfile profile = producerProfileRepository.findByUser(user)
                    .orElse(new ProducerProfile()); // Nếu chưa có thì tạo mới

            profile.setUser(user);
            profile.setBusinessName(request.getBusinessName());
            profile.setDescription(request.getDescription());
            profile.setAddress(request.getAddress());
            profile.setProvince(request.getProvince());
            profile.setMoq(request.getMoq());
            profile.setMonthlyCapacity(request.getMonthlyCapacity());
            profile.setLeadTimeDays(request.getLeadTimeDays());
            profile.setPriceMin(request.getPriceMin());
            profile.setPriceMax(request.getPriceMax());
            profile.setIsAcceptingOrders(request.getIsAcceptingOrders());

            producerProfileRepository.save(profile);
        }

        return ResponseEntity.ok("Cập nhật thành công!");
    }
}