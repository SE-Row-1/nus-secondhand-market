package edu.nus.market.service;

import org.springframework.http.ResponseEntity;

public interface EmailValidationService {
    public ResponseEntity<Object> sendOTP(String email);

    public ResponseEntity<Object> validateOTP(String email, String otp);
}
