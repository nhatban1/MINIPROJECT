package com.example.demojpa.controller;

import com.example.demojpa.entity.Device;
import com.example.demojpa.repository.DeviceRepository;
import com.example.demojpa.service.DeviceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Báo cho Spring Boot biết đây là Controller chuyên trả về dữ liệu (JSON)
@RequestMapping("/api/devices") // Đường dẫn gốc chung cho các API linh kiện
@CrossOrigin(origins = "*") // Cho phép trang web gọi API thoải mái mà không bị chặn bảo mật CORS
public class DeviceController {

    private final DeviceService deviceService;
    

    // Tiêm Service vào Controller
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }
    // 1. API LẤY DANH SÁCH (Tương ứng với phương thức GET)
    // Đường dẫn đầy đủ: GET http://localhost:8080/api/devices
    @GetMapping("/{id}")
    public Device getDeviceById(@PathVariable Long id) {
        return deviceService.getDeviceById(id);
    }

    // 2. API THÊM MỚI hoặc SỬA (Tương ứng với phương thức POST)
    // Đường dẫn đầy đủ: POST http://localhost:8080/api/devices
    @PostMapping
    public Device saveDevice(@RequestBody Device device) {
        // @RequestBody giúp tự động dịch cục JSON từ frontend gửi lên thành đối tượng Java Device
        return deviceService.saveDevice(device);
    }

    // 3. API XÓA (Tương ứng với phương thức DELETE)
    // Đường dẫn đầy đủ: DELETE http://localhost:8080/api/devices/5 (với 5 là id cần xóa)
    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable Long id) {
        // @PathVariable giúp lấy con số ID trên đường dẫn URL xuống để dùng
        deviceService.deleteDevice(id);
    }
}