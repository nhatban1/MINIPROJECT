package com.example.demojpa.controller;

import com.example.demojpa.entity.User;
import com.example.demojpa.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. API Đăng ký tài khoản lưu vào MySQL
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User newUser) {
        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại!");
        }
        userRepository.save(newUser);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // 2. API Đăng nhập đối chiếu từ MySQL
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser) {
        User user = userRepository.findByUsername(loginUser.getUsername()).orElse(null);
        
        if (user != null && user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.ok("Đăng nhập thành công!");
        }
        return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu!");
    }
}