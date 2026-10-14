package com.atelier.user.dto;
import lombok.Data;

@Data
public class ProfileDto {
    // Thông tin chung của User
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String avatarUrl;
    private String status;
    private Boolean emailVerified;
    private String createdAt;

    // Thông tin riêng của Producer
    private String businessName;
    private String description;
    private String address;
    private String province;
    private Integer moq;
    private Integer monthlyCapacity;
    private Integer leadTimeDays;
    private Double priceMin;
    private Double priceMax;
    private Boolean isAcceptingOrders;
}