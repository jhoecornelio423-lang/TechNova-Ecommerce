package com.ecommerce.ropa.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private Integer categoriaId;
    private String talla;
    private String color;
    private MultipartFile image;
}
