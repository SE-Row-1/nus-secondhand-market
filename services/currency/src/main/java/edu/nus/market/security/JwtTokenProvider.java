package edu.nus.market.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private static final String secretKey = generateSecretKey(); // 加密密钥
    private static final long expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

    public static String generateAccessToken(String userid){
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

    public static String decodeAccessToken(String token) {
        try {
            // decode JWT
            Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Token decoding failed", e);
        }
    }

    public static String generateSecretKey(){
        byte[] randomBytes = new byte[32];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes);
    }
}
