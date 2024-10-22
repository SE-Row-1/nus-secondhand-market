package edu.nus.market.service;

import edu.nus.market.pojo.ReqEntity.EmailOTPReq;
import org.springframework.http.ResponseEntity;

public interface EmailValidationService {
    public ResponseEntity<Object> sendOTP(EmailOTPReq emailOTPReq);

    public ResponseEntity<Object> validateOTP(String email, String otp);
}
