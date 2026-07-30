package com.ecommerce.ropa.repository;

import com.ecommerce.ropa.model.Order;
import com.ecommerce.ropa.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    List<Order> findByUserOrderByOrderDateDesc(User user);

    @Query("SELECT SUM(o.total) FROM Order o WHERE CAST(o.orderDate AS date) = CURRENT_DATE")
    Optional<BigDecimal> calculateTotalSalesToday();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.estado = 'PENDIENTE'")
    long countPendingOrders();
}
