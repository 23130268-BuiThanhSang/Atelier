package com.atelier.controller;

import com.atelier.order.entity.Order;
import com.atelier.repository.OrderRepository;
import com.atelier.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Value("${vnpay.tmnCode}")
    private String vnpTmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnpHashSecret;

    @Value("${vnpay.payUrl}")
    private String vnpPayUrl;

    @Value("${vnpay.returnUrl}")
    private String vnpReturnUrl;

    private final OrderRepository orderRepository;
    private final JdbcTemplate jdbcTemplate;

    public PaymentController(OrderRepository orderRepository, JdbcTemplate jdbcTemplate) {
        this.orderRepository = orderRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    // 1. Đơn bán lẻ
    @PostMapping("/create-url/{orderId}")
    public ResponseEntity<?> createPaymentUrl(@PathVariable Long orderId, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng bán lẻ"));

        if ("PAID".equals(order.getPaymentStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Đơn hàng này đã được thanh toán"));
        }

        long amount = order.getTotalAmount().longValue() * 100;
        return ResponseEntity.ok(Map.of("paymentUrl", buildVnpayUrl(order.getOrderCode(), amount, request)));
    }

    // 2.Đặt cọc 50% gia công
    @PostMapping("/production/create-url/{orderId}")
    public ResponseEntity<?> createProductionPaymentUrl(@PathVariable Long orderId, HttpServletRequest request) {
        String sql = "SELECT order_code, deposit_amount FROM production_orders WHERE id = ?";
        try {
            Map<String, Object> order = jdbcTemplate.queryForMap(sql, orderId);
            BigDecimal depositAmount = (BigDecimal) order.get("deposit_amount");
            long amount = depositAmount.longValue() * 100;
            String orderCode = (String) order.get("order_code");

            return ResponseEntity.ok(Map.of("paymentUrl", buildVnpayUrl(orderCode, amount, request)));
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy đơn gia công"));
        }
    }

    // 3. Tất toán 50% còn lại
    @PostMapping("/production-final/create-url/{orderId}")
    public ResponseEntity<?> createProductionFinalPaymentUrl(@PathVariable Long orderId, HttpServletRequest request) {
        String sql = "SELECT order_code, total_amount, deposit_amount FROM production_orders WHERE id = ?";
        try {
            Map<String, Object> order = jdbcTemplate.queryForMap(sql, orderId);
            BigDecimal totalAmount = (BigDecimal) order.get("total_amount");
            BigDecimal depositAmount = (BigDecimal) order.get("deposit_amount");

            // Tính số tiền còn lại
            BigDecimal remainingAmount = totalAmount.subtract(depositAmount);
            long amount = remainingAmount.longValue() * 100;
            String orderCode = (String) order.get("order_code");
            String vnpTxnRef = orderCode + "-F";

            return ResponseEntity.ok(Map.of("paymentUrl", buildVnpayUrl(vnpTxnRef, amount, request)));
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy đơn gia công"));
        }
    }

    private String buildVnpayUrl(String txnRef, long amount, HttpServletRequest request) {
        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang: " + txnRef);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
        vnpParams.put("vnp_IpAddr", request.getRemoteAddr());

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));

        cld.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        String queryUrl = VNPayUtil.buildQueryUrl(vnpParams);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnpHashSecret, queryUrl);
        return vnpPayUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> paymentReturn(@RequestParam Map<String, String> params) {
        String secureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String, String> sortedParams = new TreeMap<>(params);
        String queryUrl = VNPayUtil.buildQueryUrl(sortedParams);
        String checkSum = VNPayUtil.hmacSHA512(vnpHashSecret, queryUrl);

        // Lấy mã giao dịch từ VNPay
        String rawTxnRef = params.get("vnp_TxnRef");
        boolean isSuccess = "00".equals(params.get("vnp_ResponseCode"));

        if (!checkSum.equals(secureHash)) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("http://localhost:5173/my-orders")).build();
        }

        // kiểm tra và lấy mã đơn gia công
        if (rawTxnRef != null && rawTxnRef.startsWith("PO")) {
            boolean isFinalPayment = rawTxnRef.endsWith("-F");
            String actualOrderCode = rawTxnRef.replace("-F", "");

            try {
                Map<String, Object> prodOrder = jdbcTemplate.queryForMap("SELECT id, customer_id FROM production_orders WHERE order_code = ?", actualOrderCode);
                Long prodOrderId = ((Number) prodOrder.get("id")).longValue();
                Long customerId = prodOrder.get("customer_id") != null ? ((Number) prodOrder.get("customer_id")).longValue() : 1L;

                if (isSuccess) {
                    if (isFinalPayment) {
                        // Tất toán 100%
                        jdbcTemplate.update("UPDATE production_orders SET status = 'PAID_IN_FULL', current_stage = 'Đã tất toán 100% - Bàn giao', updated_at = NOW() WHERE id = ?", prodOrderId);
                        jdbcTemplate.update("INSERT INTO production_progress_updates (production_order_id, stage, note, created_by, created_at) VALUES (?, 'Đã tất toán 100% - Bàn giao', 'Khách hàng thanh toán VNPay 50% còn lại thành công', ?, NOW())", prodOrderId, customerId);
                        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:5173/my-production-orders")).build();
                    } else {
                        // Cọc 50%
                        jdbcTemplate.update("UPDATE production_orders SET status = 'DEPOSITED', current_stage = 'Đã đặt cọc 50%', updated_at = NOW() WHERE id = ?", prodOrderId);
                        jdbcTemplate.update("INSERT INTO production_progress_updates (production_order_id, stage, note, created_by, created_at) VALUES (?, 'Đã đặt cọc 50%', 'Khách hàng thanh toán VNPay đợt 1 thành công', ?, NOW())", prodOrderId, customerId);
                        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:5173/my-designs")).build();
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:5173/my-designs?payment=failed")).build();
                }
            } catch (EmptyResultDataAccessException e) {
                return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:5173/my-designs")).build();
            }
        }

        // --- Thanh toán đơn bán lẻ ---
        Optional<Order> orderOpt = orderRepository.findByOrderCode(rawTxnRef);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:5173/my-orders")).build();
        }

        Order order = orderOpt.get();
        Long orderId = order.getId();
        String frontendRedirectUrl = "http://localhost:5173/order_detail/" + orderId + "?payment=";

        if (isSuccess) {
            order.setPaymentStatus("PAID");
            order.setTransactionId(params.get("vnp_TransactionNo"));
            orderRepository.save(order);

            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:5173/order-success?orderId=" + orderId)).build();
        }

        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(frontendRedirectUrl + "failed")).build();
    }
}