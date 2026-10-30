package com.example.demojpa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String address;

    @OneToOne
    @JoinColumn(name = "user_id") // Khóa ngoại trỏ về bảng users
    private User user;

    // Getters & Setters cơ bản
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public void setUser(User user) { this.user = user; }
}