package com.example.demojpa.service;

import org.springframework.stereotype.Service;
import com.example.demojpa.entity.Category;
import com.example.demojpa.repository.CategoryRepository;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
}