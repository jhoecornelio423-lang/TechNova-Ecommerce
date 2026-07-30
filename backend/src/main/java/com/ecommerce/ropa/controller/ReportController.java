package com.ecommerce.ropa.controller;

import com.ecommerce.ropa.model.Product;
import com.ecommerce.ropa.repository.ProductRepository;
import com.ecommerce.ropa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/inventory-distribution")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getInventoryDistribution() {
        return productRepository.countProductsByCategory().stream().map(result -> {
            Map<String, Object> map = new HashMap<>();
            map.put("category", result[0]);
            map.put("count", result[1]);
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/user-growth")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getUserGrowth() {
        return userRepository.countUsersByMonth().stream().map(result -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", result[0]);
            map.put("count", result[1]);
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/low-stock-top")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Product> getLowStockTop() {
        return productRepository.findTop5ByOrderByStockAsc();
    }
}
