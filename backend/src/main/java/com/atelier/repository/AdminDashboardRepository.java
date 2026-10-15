package com.atelier.repository;

import com.atelier.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminDashboardRepository extends JpaRepository<Order, Long> {

    // 1. Tổng doanh thu trong khoảng thời gian (chỉ tính đơn hoàn tất hoặc đã thanh toán)
    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate
          AND o.status NOT IN ('CANCELLED')
    """)
    BigDecimal calculateTotalRevenue(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 2. Tổng đơn hàng trong khoảng thời gian
    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate
    """)
    long countOrders(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 3. Số người dùng mới đăng ký
    @Query("""
        SELECT COUNT(u)
        FROM User u
        WHERE u.createdAt >= :startDate AND u.createdAt <= :endDate
    """)
    long countNewUsers(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 4. Tổng số lượng sản phẩm bán ra
    @Query("""
        SELECT COALESCE(SUM(oi.quantity), 0)
        FROM OrderItem oi
        JOIN oi.order o
        WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate
          AND o.status NOT IN ('CANCELLED')
    """)
    long countSoldProducts(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 5. Thống kê theo từng ngày phục vụ Biểu đồ cột
    @Query("""
        SELECT DATE(o.createdAt) as orderDate,
               COALESCE(SUM(o.totalAmount), 0) as netRev,
               COALESCE(SUM(o.subtotal), 0) as grossRev,
               COUNT(o.id) as totalOrders
        FROM Order o
        WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate
          AND o.status NOT IN ('CANCELLED')
        GROUP BY DATE(o.createdAt)
        ORDER BY DATE(o.createdAt) ASC
    """)
    List<Object[]> getDailyRevenueAndOrders(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 6. Phân bổ theo danh mục sản phẩm phục vụ Biểu đồ tròn
    @Query("""
        SELECT c.name, COUNT(oi.id)
        FROM OrderItem oi
        JOIN oi.order o
        JOIN oi.productVariant pv
        JOIN pv.product p
        JOIN p.category c
        WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate
          AND o.status NOT IN ('CANCELLED')
        GROUP BY c.id, c.name
        ORDER BY COUNT(oi.id) DESC
    """)
    List<Object[]> getOrdersDistributionByCategory(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}