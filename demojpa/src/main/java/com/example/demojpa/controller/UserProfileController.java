package com.example.demojpa.controller;

import com.example.demojpa.entity.User;
import com.example.demojpa.entity.UserProfile;
import com.example.demojpa.repository.UserRepository;
import com.example.demojpa.repository.UserProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileRepository profileRepository;
    private final UserRepository userRepository;

    public UserProfileController(UserProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // 1. API Lấy thông tin profile
    @GetMapping("/{username}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserProfile profile = profileRepository.findByUser(user);
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }
        return ResponseEntity.ok(profile);
    }

    // 2. API Lưu hoặc Cập nhật thông tin profile (Trả về JSON Object chuẩn)
    @PostMapping
    public ResponseEntity<UserProfile> saveProfile(@RequestParam String username, @RequestBody UserProfile newInfo) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        UserProfile profile = profileRepository.findByUser(user);
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }

        // Cập nhật thông tin mới
        profile.setFullName(newInfo.getFullName());
        profile.setEmail(newInfo.getEmail());
        profile.setPhone(newInfo.getPhone());
        profile.setAddress(newInfo.getAddress());

        UserProfile saved = profileRepository.save(profile);
        // Trả về thẳng object đã lưu (định dạng JSON) để client xử lý mượt mà
        return ResponseEntity.ok(saved);
    }
}