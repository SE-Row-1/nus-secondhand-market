package edu.nus.market.service;

import edu.nus.market.security.OTPGenerator;
import jakarta.annotation.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class EmailValidationServiceImpl implements EmailValidationService{

    @Resource
    private JavaMailSender mailSender;

    @Resource
    private OTPGenerator otpGenerator;

    @Override
    public ResponseEntity<Object> sendOTP(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your Verification Code");
        message.setText("Your verification code is: " + otpGenerator.generateOTP(6));
        message.setFrom("1254023440@qq.com");  // 发件人邮箱

        mailSender.send(message);
        return null;
    }

    @Override
    public ResponseEntity<Object> validateOTP(String email, String otp) {
        // TODO: validate OTP
        return null;
    }



}
