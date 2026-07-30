package com.ecommerce.ropa.controller;

import com.ecommerce.ropa.dto.response.DashboardStatsDTO;
import com.ecommerce.ropa.repository.CategoryRepository;
import com.ecommerce.ropa.repository.OrderRepository;
import com.ecommerce.ropa.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/stats")
public class AdminDashboardController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardStatsDTO getStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalProducts(productService.countTotalProducts());
        stats.setTotalCategories(categoryRepository.count());
        stats.setLowStockProducts(productService.countLowStockProducts(10));
        
        // Consultas reales a la tabla de Ordenes
        BigDecimal todaySales = orderRepository.calculateTotalSalesToday().orElse(BigDecimal.ZERO);
        stats.setTotalSalesToday(todaySales.doubleValue());
        stats.setPendingOrders(orderRepository.countPendingOrders());
        
        return stats;
    }
}
