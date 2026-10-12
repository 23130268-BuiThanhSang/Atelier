package com.atelier.service;

import com.atelier.auth.dto.LoginRequest;
import com.atelier.auth.dto.RegisterRequest;
import com.atelier.entity.User;
import com.atelier.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor

public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Đăng ký
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole().toUpperCase());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // mã hoá mk

        userRepository.save(user);
        return "Đăng ký thành công!";
    }

    //Đăng nhập
    public String login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Tài khoản không tồn tại!");
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu!");
        }
        return "Đăng nhập thành công!";
    }

}
