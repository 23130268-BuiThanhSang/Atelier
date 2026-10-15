package com.atelier.user.dto;

import java.time.LocalDateTime;

public class AdminUserDto {

    public record ListItem(
            Long id,
            String fullName,
            String email,
            String phone,
            String avatarUrl,
            String role,
            long orderCount,
            String status,
            LocalDateTime createdAt
    ) {}

    public record Detail(
            Long id,
            String fullName,
            String email,
            String phone,
            String address,
            String avatarUrl,
            String role,
            long totalOrders,
            String status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}

    public record MetricResponse(
            long producerCount,
            long customerCount
    ) {}

    public record UpdateStatusRequest(
            String status
    ) {}
}