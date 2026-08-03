package com.ecommerce.ropa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Ordenes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @Column(name = "fecha_pedido")
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(nullable = false)
    private BigDecimal total;

    @Column(length = 20)
    private String estado = "PENDIENTE";

    @Column(name = "direccion_envio")
    private String shippingAddress;

    @Column(length = 20)
    private String dni;

    @Column(name = "nombre_cliente", length = 100)
    private String customerName;

    @Column(name = "email_cliente", length = 100)
    private String customerEmail;

    @Column(name = "costo_envio")
    private BigDecimal shippingCost;

    @Column(name = "tipo_entrega", length = 20)
    private String deliveryMethod = "DELIVERY";

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items; // Cambiado para evitar conflictos de inicialización con Jackson
}
