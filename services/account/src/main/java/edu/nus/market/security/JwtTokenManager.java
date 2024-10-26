package edu.nus.market.security;

import edu.nus.market.pojo.ResEntity.JWTPayload;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.HttpCookie;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenManager {

    private static String secretKey;

    private static final long expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

    @Value("${jwt.secretKey}")
    private String injectedSecretKey;

    @PostConstruct
    public void init() {
        JwtTokenManager.secretKey = injectedSecretKey;
    }

    public static String generateAccessToken(JWTPayload jwtPayload){
        return Jwts.builder()
            .claim("id", jwtPayload.getId())
            .claim("nickname", jwtPayload.getNickname())
            .claim("avatar_url", jwtPayload.getAvatarUrl())
            .claim("email", jwtPayload.getEmail())

            .setIssuedAt(new Date())
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
        String token = Arrays.stream(Cookie.split("; "))
            .filter(part -> part.startsWith("access_token="))
            .map(part -> part.split("=")[1])
            .findFirst()
            .orElse(null);

        if (token == null) {
            return false;
        }

        return validateToken(token);
    }

    public static JWTPayload decodeAccessToken(String token) {
        try {
            // decode JWT
            Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

            JWTPayload jwtPayload = new JWTPayload((int) claims.get("id"), (String)claims.get("nickname"),
                (String)claims.get("avatar_url"), (String)claims.get("email"));

            return jwtPayload;

        } catch (Exception e) {
            throw new RuntimeException("Token decoding failed", e);
        }
    }

    public static JWTPayload decodeCookie(String cookie) {
        if (cookie == null || cookie.isEmpty()) {
            throw new IllegalArgumentException("Cookie cannot be null or empty");
        }

        List<HttpCookie> cookies = HttpCookie.parse(cookie);

        String token = cookies.stream()
            .filter(c -> "access_token".equals(c.getName()))
            .map(HttpCookie::getValue)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Missing access_token in the provided cookie"));

        return decodeAccessToken(token);
    }

    public static String generateSecretKey(){
        byte[] randomBytes = new byte[32];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes);
    }
}
