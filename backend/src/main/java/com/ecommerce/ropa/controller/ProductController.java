package com.ecommerce.ropa.controller;

import com.ecommerce.ropa.model.Category;
import com.ecommerce.ropa.model.Product;
import com.ecommerce.ropa.repository.CategoryRepository;
import com.ecommerce.ropa.service.FileStorageService;
import com.ecommerce.ropa.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Integer categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam("name") String name) {
        return productService.searchProducts(name);
    }

    @GetMapping("/{id}/related")
    public List<Product> getRelatedProducts(@PathVariable Integer id) {
        return productService.getProductById(id)
                .map(product -> productService.getProductsByCategory(product.getCategoria().getId())
                        .stream()
                        .filter(p -> !p.getId().equals(id))
                        .limit(4)
                        .collect(java.util.stream.Collectors.toList()))
                .orElse(java.util.Collections.emptyList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam("talla") String talla,
            @RequestParam("color") String color,
            @RequestParam("image") MultipartFile image) {
        try {
            Category category = categoryRepository.findById(categoriaId)
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

            Product product = new Product();
            product.setNombre(nombre);
            product.setDescripcion(descripcion);
            product.setPrecio(precio);
            product.setStock(stock);
            product.setTalla(talla);
            product.setColor(color);
            product.setCategoria(category);
            
            String filename = fileStorageService.save(image);
            product.setImagenUrl("/api/products/images/" + filename);
            
            return ResponseEntity.ok(productService.saveProduct(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam("talla") String talla,
            @RequestParam("color") String color,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return productService.getProductById(id)
                .map(product -> {
                    try {
                        Category category = categoryRepository.findById(categoriaId)
                                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

                        product.setNombre(nombre);
                        product.setDescripcion(descripcion);
                        product.setPrecio(precio);
                        product.setStock(stock);
                        product.setTalla(talla);
                        product.setColor(color);
                        product.setCategoria(category);
                        
                        if (image != null && !image.isEmpty()) {
                            String filename = fileStorageService.save(image);
                            product.setImagenUrl("/api/products/images/" + filename);
                        }
                        
                        return ResponseEntity.ok(productService.saveProduct(product));
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().<Product>build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        return productService.getProductById(id)
                .map(product -> {
                    productService.deleteProduct(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Resource file = fileStorageService.load(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
