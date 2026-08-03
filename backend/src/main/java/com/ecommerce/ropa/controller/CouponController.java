package com.ecommerce.ropa.controller;

import com.ecommerce.ropa.model.Coupon;
import com.ecommerce.ropa.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validateCoupon(@PathVariable String code) {
        return couponRepository.findByCodigoAndActivoTrue(code)
                .map(coupon -> {
                    if (coupon.getFechaVencimiento() != null && coupon.getFechaVencimiento().isBefore(LocalDateTime.now())) {
                        return ResponseEntity.badRequest().body("El cupón ha vencido.");
                    }
                    return ResponseEntity.ok(coupon);
                })
                .orElse(ResponseEntity.badRequest().body("Cupón inválido o inactivo."));
    }
}
