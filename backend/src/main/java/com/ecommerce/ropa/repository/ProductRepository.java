package com.ecommerce.ropa.repository;

import com.ecommerce.ropa.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoriaId(Integer categoriaId);
}
