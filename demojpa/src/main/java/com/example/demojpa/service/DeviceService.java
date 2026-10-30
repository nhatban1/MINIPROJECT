package com.example.demojpa.service;

import com.example.demojpa.entity.Device;
import com.example.demojpa.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // Báo cho Spring Boot biết đây là tầng xử lý nghiệp vụ
public class DeviceService {

    // Tiêm (inject) Repository vào để dùng
    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    // 1. Lấy toàn bộ danh sách linh kiện
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }
    public Device getDeviceById(Long id) {
        return deviceRepository.findById(id).orElse(null);
    }
    // 2. Lưu hoặc Sửa linh kiện
    public Device saveDevice(Device device) {
        return deviceRepository.save(device);
    }

    // 3. Xóa linh kiện theo ID
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }
}