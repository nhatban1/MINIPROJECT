package com.example.demojpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demojpa.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}