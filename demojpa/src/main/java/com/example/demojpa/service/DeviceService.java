package com.example.demojpa.service;

import org.springframework.stereotype.Service;
import com.example.demojpa.dto.DeviceRequest;
import com.example.demojpa.entity.Category;
import com.example.demojpa.entity.Device;
import com.example.demojpa.repository.CategoryRepository;
import com.example.demojpa.repository.DeviceRepository;
import java.util.List;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final CategoryRepository categoryRepository;

    public DeviceService(DeviceRepository deviceRepository, CategoryRepository categoryRepository) {
        this.deviceRepository = deviceRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Device getDeviceById(Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found with ID: " + id));
    }

    public Device createDevice(DeviceRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));

        Device device = new Device(request.getName(), request.getSku(), request.getPrice());
        device.setCategory(category);

        return deviceRepository.save(device);
    }

    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }
}