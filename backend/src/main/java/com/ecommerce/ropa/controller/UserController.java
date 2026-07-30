package com.ecommerce.ropa.controller;

import com.ecommerce.ropa.model.Role;
import com.ecommerce.ropa.model.User;
import com.ecommerce.ropa.repository.RoleRepository;
import com.ecommerce.ropa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRoles(@PathVariable Integer id, @RequestBody List<String> roleNames) {
        return userRepository.findById(id)
                .map(user -> {
                    Set<Role> roles = new HashSet<>();
                    roleNames.forEach(roleName -> {
                        Role role = roleRepository.findByNombre(roleName)
                                .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " not found."));
                        roles.add(role);
                    });
                    
                    user.setRoles(roles);
                    userRepository.save(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
