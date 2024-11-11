package edu.nus.market.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class PasswordHasher {

    public String hashPassword(String password, byte[] salt){

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String passwordHash = passwordEncoder.encode(password + Base64.getEncoder().encodeToString(salt));

        return passwordHash;
    }

}
