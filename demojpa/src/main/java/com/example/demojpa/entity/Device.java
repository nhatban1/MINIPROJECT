package com.example.demojpa.entity; // (Hoặc package của bạn)

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    private String sku; // <-- Bổ sung trường SKU này vào đây

    private Double price;

    // Quan hệ 1:N với Category
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Quan hệ N:N với Tag (tự sinh bảng trung gian device_tag)
    @ManyToMany
    @JoinTable(
        name = "device_tag",
        joinColumns = @JoinColumn(name = "device_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    public Device() {}

    // --- GETTERS VÀ SETTERS (Đầy đủ cho tất cả các trường) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public List<Tag> getTags() { return tags; }
    public void setTags(List<Tag> tags) { this.tags = tags; }
}