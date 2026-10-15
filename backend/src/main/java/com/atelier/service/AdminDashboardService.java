package com.atelier.service;

import com.atelier.admin.dto.AdminDashboardResponse;
import com.atelier.admin.dto.AdminDashboardResponse.*;
import com.atelier.repository.AdminDashboardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminDashboardService {

    private final AdminDashboardRepository dashboardRepository;

    private static final String[] CHART_COLORS = {
            "#f0592a", // Cam Atelier
            "#18181b", // Đen Zinc-900
            "#71717a", // Xám Zinc-500
            "#d4d4d8", // Xám nhạt Zinc-300
            "#fefccf"  // Vàng nhạt Cream
    };

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStatistics(LocalDate fromDate, LocalDate toDate) {
        // Mặc định nếu không truyền ngày: lấy 30 ngày gần nhất
        LocalDate end = (toDate != null) ? toDate : LocalDate.now();
        LocalDate start = (fromDate != null) ? fromDate : end.minusDays(29);

        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX);

        log.info("Lấy thống kê Admin Dashboard từ {} đến {}", startDateTime, endDateTime);

        // 1. Tính toán 4 KPI
        BigDecimal totalRevenue = dashboardRepository.calculateTotalRevenue(startDateTime, endDateTime);
        long totalOrders = dashboardRepository.countOrders(startDateTime, endDateTime);
        long newUsers = dashboardRepository.countNewUsers(startDateTime, endDateTime);
        long soldProducts = dashboardRepository.countSoldProducts(startDateTime, endDateTime);

        KpiSummary kpis = new KpiSummary(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalOrders,
                newUsers,
                soldProducts
        );

        // 2. Xử lý dữ liệu biểu đồ tăng trưởng (Cột)
        List<Object[]> rawDaily = dashboardRepository.getDailyRevenueAndOrders(startDateTime, endDateTime);
        Map<LocalDate, GrowthChartPoint> dailyMap = new HashMap<>();
        DateTimeFormatter labelFormatter = DateTimeFormatter.ofPattern("dd/MM");

        for (Object[] row : rawDaily) {
            // Chuyển đổi an toàn cho cột ngày (hỗ trợ cả java.sql.Date, LocalDate, String)
            LocalDate date;
            Object dateObj = row[0];
            if (dateObj instanceof java.sql.Date sqlDate) {
                date = sqlDate.toLocalDate();
            } else if (dateObj instanceof LocalDate localDate) {
                date = localDate;
            } else {
                date = LocalDate.parse(dateObj.toString());
            }

            BigDecimal net = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
            BigDecimal gross = row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO;
            long count = row[3] != null ? ((Number) row[3]).longValue() : 0L;

            dailyMap.put(date, new GrowthChartPoint(date, date.format(labelFormatter), net, gross, count));
        }

        // BƯỚC 2.1: Lọc tất cả các ngày có doanh thu > 0 trong khoảng thời gian, lấy Top 10 doanh số cao nhất
        List<GrowthChartPoint> topRevenueDays = dailyMap.values().stream()
                .filter(pt -> pt.netRevenue() != null && pt.netRevenue().compareTo(BigDecimal.ZERO) > 0)
                .sorted((a, b) -> b.netRevenue().compareTo(a.netRevenue()))
                .limit(10)
                .toList();

        log.info("Tìm thấy {} ngày có doanh thu > 0 trong khoảng lọc.", topRevenueDays.size());

        Set<LocalDate> chosenDates = new HashSet<>();
        List<GrowthChartPoint> selectedPoints = new ArrayList<>();

        for (GrowthChartPoint pt : topRevenueDays) {
            chosenDates.add(pt.date());
            selectedPoints.add(pt);
        }

        // BƯỚC 2.2: Nếu chưa đủ 10 ngày, lấy bù từ mốc ngày kết thúc (endDate) đếm lùi về trước
        LocalDate backtrackDate = end;
        while (selectedPoints.size() < 10 && !backtrackDate.isBefore(start)) {
            if (!chosenDates.contains(backtrackDate)) {
                chosenDates.add(backtrackDate);
                GrowthChartPoint fallbackPt = dailyMap.getOrDefault(
                        backtrackDate,
                        new GrowthChartPoint(backtrackDate, backtrackDate.format(labelFormatter), BigDecimal.ZERO, BigDecimal.ZERO, 0)
                );
                selectedPoints.add(fallbackPt);
            }
            backtrackDate = backtrackDate.minusDays(1);
        }

        // BƯỚC 2.3: SẮP XẾP LẠI TOÀN BỘ THEO THỨ TỰ THỜI GIAN TĂNG DẦN
        List<GrowthChartPoint> growthPoints = selectedPoints.stream()
                .sorted(Comparator.comparing(GrowthChartPoint::date))
                .toList();

        // 3. Xử lý biểu đồ tròn phân bổ danh mục
        List<Object[]> rawCategories = dashboardRepository.getOrdersDistributionByCategory(startDateTime, endDateTime);
        long catTotalOrders = 0;
        for (Object[] row : rawCategories) {
            catTotalOrders += ((Number) row[1]).longValue();
        }

        List<CategoryItem> categoryItems = new ArrayList<>();
        int colorIdx = 0;
        for (Object[] row : rawCategories) {
            String catName = (String) row[0];
            long count = ((Number) row[1]).longValue();
            double pct = (catTotalOrders > 0) ? Math.round(((double) count / catTotalOrders * 100.0) * 10.0) / 10.0 : 0.0;
            String color = CHART_COLORS[colorIdx % CHART_COLORS.length];
            colorIdx++;

            categoryItems.add(new CategoryItem(catName, count, pct, color));
        }

        CategoryDistribution categoryDistribution = new CategoryDistribution(catTotalOrders, categoryItems);

        return new AdminDashboardResponse(kpis, growthPoints, categoryDistribution);
    }
}