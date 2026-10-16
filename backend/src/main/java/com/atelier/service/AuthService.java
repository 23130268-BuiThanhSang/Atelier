package com.atelier.service;

import com.atelier.auth.dto.LoginRequest;
import com.atelier.auth.dto.RegisterRequest;
import com.atelier.user.dto.ResetPasswordRequest;
import com.atelier.user.entity.Role;
import com.atelier.user.entity.User;
import com.atelier.repository.RoleRepository;
import com.atelier.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final Map<String, TempUserInfo> otpCache = new ConcurrentHashMap<>(); // lưu tạm user khi đăng ký
    private final Map<String, ResetTokenInfo> resetTokenCache = new ConcurrentHashMap<>(); //quên mk

    private static class TempUserInfo { // chứa dữ liệu tạm
        public RegisterRequest request;
        public String otp;
        public LocalDateTime expiryTime;

        public TempUserInfo(RegisterRequest request, String otp, LocalDateTime expiryTime) {
            this.request = request;
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
    public static class ResetTokenInfo {
        public String email;
        public LocalDateTime expiryTime;
        public boolean isUsed;

        public ResetTokenInfo(String email, LocalDateTime expiryTime) {
            this.email = email;
            this.expiryTime = expiryTime;
            this.isUsed = false;
        }
    }

    public String requestRegisterAndSendOtp(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);
        otpCache.put(request.getEmail(), new TempUserInfo(request, otp, expiryTime));

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Atelier System <no-reply@atelier.com>");
            message.setTo(request.getEmail());
            message.setSubject("Mã xác thực tài khoản Atelier của bạn");
            message.setText("Chào " + request.getFullName() + ",\n\n"
                    + "Mã OTP xác minh tài khoản của bạn là: " + otp + "\n"
                    + "Mã này sẽ hết hạn trong vòng 5 phút.\n\n"
                    + "Trân trọng,\nĐội ngũ Atelier");

            mailSender.send(message);
        } catch (Exception e) {
            otpCache.remove(request.getEmail());
            throw new RuntimeException("Lỗi hệ thống: Không thể gửi email lúc này!");
        }

        return "Mã OTP đã được gửi đến email của bạn!";
    }

    // Đã xác thực email và tiến hành lưu db
    public String verifyOtpAndSaveUser(String email, String inputOtp) {
        TempUserInfo tempInfo = otpCache.get(email);

        if (tempInfo == null) {
            throw new RuntimeException("Không tìm thấy yêu cầu đăng ký hoặc đã bị hủy!");
        }

        if (LocalDateTime.now().isAfter(tempInfo.expiryTime)) {
            otpCache.remove(email);
            throw new RuntimeException("Mã OTP đã hết hạn! Vui lòng đăng ký lại.");
        }

        if (!tempInfo.otp.equals(inputOtp)) {
            throw new RuntimeException("Mã OTP không chính xác!");
        }

        RegisterRequest request = tempInfo.request;
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        String roleName = request.getRole().toUpperCase();
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền: " + roleName));
        user.getRoles().add(role);
        userRepository.save(user);
        otpCache.remove(email);

        return "Đăng ký thành công!";
    }

    // ĐĂNG NHẬP
    public Map<String, String> login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Tài khoản không tồn tại!");
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Sai mật khẩu!");
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đăng nhập thành công!");
        response.put("userId", String.valueOf(user.getId()));
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        String roleName = user.getRoles().iterator().next().getName();
        response.put("role", roleName);
        return response;
    }

    // Quên mk
    public String requestPasswordReset(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("Không tìm thấy tài khoản nào được liên kết với email này.");
        }
        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);
        resetTokenCache.put(resetToken, new ResetTokenInfo(email, expiryTime));

        try {
            String resetLink = "http://localhost:5173/reset_password?token=" + resetToken;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Atelier System <no-reply@atelier.com>");
            message.setTo(email);
            message.setSubject("Đặt lại mật khẩu tài khoản Atelier");
            message.setText("Bạn vừa yêu cầu đặt lại mật khẩu.\n\n"
                    + "Vui lòng click vào đường link dưới đây để đổi mật khẩu mới:\n"
                    + resetLink + "\n\n"
                    + "Liên kết này sẽ tự động hết hạn sau 5 phút.\n"
                    + "Nếu bạn không yêu cầu, vui lòng bỏ qua email này.");

            mailSender.send(message);
        } catch (Exception e) {
            resetTokenCache.remove(resetToken);
            throw new RuntimeException("Không thể gửi email lúc này. Vui lòng thử lại sau.");
        }

        return "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.";
    }

    public String resetPassword(ResetPasswordRequest request) {
        String token = request.getToken();
        String newPassword = request.getNewPassword();
        ResetTokenInfo tempInfo = resetTokenCache.get(token);
        if (tempInfo == null) {
            throw new RuntimeException("Liên kết đặt lại mật khẩu không hợp lệ hoặc không tồn tại.");
        }
        if (tempInfo.isUsed) {
            throw new RuntimeException("Liên kết này ĐÃ ĐƯỢC SỬ DỤNG. Mỗi liên kết chỉ có hiệu lực một lần.");
        }
        if (LocalDateTime.now().isAfter(tempInfo.expiryTime)) {
            resetTokenCache.remove(token);
            throw new RuntimeException("Liên kết này đã HẾT HẠN. Vui lòng yêu cầu cấp lại liên kết mới.");
        }

        String email = tempInfo.email;
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại."));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tempInfo.isUsed = true;
        return "Mật khẩu đã được cập nhật thành công!";
    }

    // Chạy tự động mỗi 1 giờ để dọn rác
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        resetTokenCache.entrySet().removeIf(entry ->
                now.isAfter(entry.getValue().expiryTime)
        );
        System.out.println("Đã dọn dẹp các Token hết hạn khỏi bộ nhớ.");
    }
    public boolean isResetTokenValid(String token) {
        ResetTokenInfo tempInfo = resetTokenCache.get(token);
        return tempInfo != null && !tempInfo.isUsed && LocalDateTime.now().isBefore(tempInfo.expiryTime);
    }
}