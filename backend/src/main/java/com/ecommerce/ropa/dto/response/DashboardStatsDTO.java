package com.ecommerce.ropa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalProducts;
    private long totalCategories;
    private long lowStockProducts;
    private double totalSalesToday;
    private long pendingOrders;
}
