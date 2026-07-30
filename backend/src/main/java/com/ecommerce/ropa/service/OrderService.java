package com.ecommerce.ropa.service;

import com.ecommerce.ropa.model.Order;
import com.ecommerce.ropa.model.OrderItem;
import com.ecommerce.ropa.model.Product;
import com.ecommerce.ropa.repository.OrderRepository;
import com.ecommerce.ropa.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order createOrder(Order order) {
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProduct().getId()));

            // Verificar Stock
            if (product.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + product.getNombre());
            }

            // Actualizar Stock
            product.setStock(product.getStock() - item.getCantidad());
            productRepository.save(product);

            // Fijar precio del momento de compra
            item.setUnitPrice(product.getPrecio());
            item.setOrder(order);

            BigDecimal itemSubtotal = product.getPrecio().multiply(new BigDecimal(item.getCantidad()));
            total = total.add(itemSubtotal);
        }

        order.setTotal(total);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
