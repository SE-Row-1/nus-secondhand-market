package edu.nus.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @GetMapping("/healthz")
    public ResponseEntity<String> livenessCheck() {
        return ResponseEntity.ok("Liveness check OK");
    }

    @GetMapping("/ready")
    public ResponseEntity<String> readinessCheck() {
        return ResponseEntity.ok("Readiness check OK");
    }
}
