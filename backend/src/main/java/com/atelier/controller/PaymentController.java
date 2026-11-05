package com.atelier.controller;

import com.atelier.order.entity.Order;
import com.atelier.repository.OrderRepository;
import com.atelier.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    public PaymentController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping("/create-url/{orderId}")
    public ResponseEntity<?> createPaymentUrl(@PathVariable Long orderId, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if ("PAID".equals(order.getPaymentStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Đơn hàng này đã được thanh toán"));
        }

        // VNPay yêu cầu số tiền nhân với 100
        long amount = order.getTotalAmount().longValue() * 100;

        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", order.getOrderCode());
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang: " + order.getOrderCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
        vnpParams.put("vnp_IpAddr", request.getRemoteAddr());

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));

        cld.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        // Tạo chuỗi hash
        String queryUrl = VNPayUtil.buildQueryUrl(vnpParams);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnpHashSecret, queryUrl);
        String paymentUrl = vnpPayUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;

        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> paymentReturn(@RequestParam Map<String, String> params) {

        String secureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String, String> sortedParams = new TreeMap<>(params);
        String queryUrl = VNPayUtil.buildQueryUrl(sortedParams);
        String checkSum = VNPayUtil.hmacSHA512(vnpHashSecret, queryUrl);

        String orderCode = params.get("vnp_TxnRef");

        // 1. TÌM ĐƠN HÀNG BẰNG ORDER_CODE TRƯỚC
        Optional<Order> orderOpt = orderRepository.findByOrderCode(orderCode);

        // Nếu không tìm thấy đơn hàng, đá về trang danh sách đơn hàng
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("http://localhost:5173/my-orders")).build();
        }

        Order order = orderOpt.get();

        // 2. LẤY ID ĐỂ ĐƯA VÀO ĐƯỜNG DẪN REACT
        Long orderId = order.getId();
        String frontendRedirectUrl = "http://localhost:5173/order_detail/" + orderId + "?payment=";

        // 3. KIỂM TRA CHỮ KÝ VÀ TRẠNG THÁI THANH TOÁN
        if (checkSum.equals(secureHash)) {
            if ("00".equals(params.get("vnp_ResponseCode"))) {
                // Thanh toán thành công
                order.setPaymentStatus("PAID");
                order.setTransactionId(params.get("vnp_TransactionNo"));
                orderRepository.save(order);

                String successUrl = "http://localhost:5173/order-success?orderId=" + orderId;
                return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(successUrl)).build();
            }
        }

        // Thanh toán thất bại hoặc chữ ký không hợp lệ
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(frontendRedirectUrl + "failed")).build();
    }
}
