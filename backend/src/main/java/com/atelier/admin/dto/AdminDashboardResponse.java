package com.atelier.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record AdminDashboardResponse(
        KpiSummary kpis,
        List<GrowthChartPoint> growthChart,
        CategoryDistribution categoryDistribution
) {
    public record KpiSummary(
            BigDecimal totalRevenue,
            long totalOrders,
            long newUsers,
            long soldProducts
    ) {}

    public record GrowthChartPoint(
            LocalDate date,
            String label,             // ví dụ: "02/10", "14/10"
            BigDecimal netRevenue,    // Doanh thu thuần
            BigDecimal grossRevenue,  // Tổng doanh số cơ bản
            long orderCount           // Số lượng đơn hàng
    ) {}

    public record CategoryDistribution(
            long totalCount,
            List<CategoryItem> items
    ) {}

    public record CategoryItem(
            String label,
            long count,
            double percentage,
            String color
    ) {}
}