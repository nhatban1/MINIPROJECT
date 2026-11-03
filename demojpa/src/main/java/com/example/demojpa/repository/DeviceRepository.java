package com.example.demojpa.repository;

import com.example.demojpa.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    // Spring Boot tự động lo các hàm cơ bản như: findAll(), save(), deleteById(), findById()...
}