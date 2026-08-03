package com.ecommerce.ropa.service;

import com.ecommerce.ropa.model.Order;
import com.ecommerce.ropa.model.OrderItem;
import com.ecommerce.ropa.model.Product;
import com.ecommerce.ropa.model.User;
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
        System.out.println("DEBUG: Iniciando creacion de orden para: " + order.getCustomerName());
        System.out.println("DEBUG: Costo de envio recibido: " + order.getShippingCost());
        
        BigDecimal itemsTotal = BigDecimal.ZERO;

        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new RuntimeException("El pedido no contiene productos.");
        }

        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado ID: " + item.getProduct().getId()));

            if (product.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + product.getNombre());
            }

            // Actualizar stock
            product.setStock(product.getStock() - item.getCantidad());
            productRepository.save(product);

            // Fijar datos del item
            item.setUnitPrice(product.getPrecio());
            item.setOrder(order);

            BigDecimal subtotal = product.getPrecio().multiply(new BigDecimal(item.getCantidad()));
            itemsTotal = itemsTotal.add(subtotal);
            
            System.out.println("   [+] Item: " + product.getNombre() + " x" + item.getCantidad() + " = S/ " + subtotal);
        }

        // Calcular Total Final
        BigDecimal finalTotal = itemsTotal;
        if (order.getShippingCost() != null) {
            finalTotal = finalTotal.add(order.getShippingCost());
        }

        order.setTotal(finalTotal);
        System.out.println("DEBUG: Total calculado final: S/ " + finalTotal);

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateOrderStatus(Integer orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        order.setEstado(status);
        return orderRepository.save(order);
    }
}
