package com.example.demojpa.repository;

import com.example.demojpa.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm kiếm user dựa vào username để phục vụ việc lấy profile
    Optional<User> findByUsername(String username);
}