package edu.nus.market.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenManager {

    private static String secretKey;

    private static final long expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

    public static String generateAccessToken(int userid){
        return Jwts.builder()
            .setSubject(String.valueOf(userid))
            .setIssuedAt(new Date())//登录时间
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .setExpiration(new Date(new Date().getTime() + expirationTime))
            .compact();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean validateCookie(String Cookie) {
        // extract the access token from the cookie and validate it using validateToken method
        String token = Cookie.split("; ")[0].split("=")[1];

        return validateToken(token);
    }

    public static int decodeAccessToken(String token) {
        try {
            // decode JWT
            Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

            return Integer.parseInt(claims.getSubject());
        } catch (Exception e) {
            throw new RuntimeException("Token decoding failed", e);
        }
    }

    public static int decodeCookie(String cookie) {
        String token = cookie.split("; ")[0].split("=")[1];
        return decodeAccessToken(token);
    }

    public static String generateSecretKey(){
        byte[] randomBytes = new byte[32];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes);
    }

    public JwtTokenManager(@Value("${jwt.secretKey}")String secretKey){
        this.secretKey = secretKey;
    }
}
