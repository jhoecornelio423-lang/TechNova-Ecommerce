package com.ecommerce.ropa.repository;

import com.ecommerce.ropa.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Map;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoriaId(Integer categoriaId);
    
    List<Product> findTop5ByOrderByStockAsc();

    @Query("SELECT p.categoria.nombre as category, COUNT(p) as count FROM Product p GROUP BY p.categoria.nombre")
    List<Object[]> countProductsByCategory();
}
