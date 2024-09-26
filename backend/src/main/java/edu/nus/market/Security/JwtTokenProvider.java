package edu.nus.market.Security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private final String secretKey = generateSecretKey(); // 加密密钥
    private final long expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

    public String generateAccessToken(String userid){
        return Jwts.builder()
            .setSubject(userid)
            .setIssuedAt(new Date())//登录时间
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .setExpiration(new Date(new Date().getTime() + expirationTime))
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String generateSecretKey(){
        byte[] randomBytes = new byte[32];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes);
    }
}
