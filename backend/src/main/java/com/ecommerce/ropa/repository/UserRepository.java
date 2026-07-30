package com.ecommerce.ropa.repository;

import com.ecommerce.ropa.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Query(value = "SELECT to_char(fecha_creacion, 'YYYY-MM') as month, COUNT(*) as count " +
           "FROM usuarios GROUP BY month ORDER BY month ASC", nativeQuery = true)
    List<Object[]> countUsersByMonth();
}
