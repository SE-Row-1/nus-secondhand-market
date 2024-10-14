package edu.nus.market.security;

import edu.nus.market.pojo.ResEntity.ResAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenManager {

    private static String secretKey;

    private static final long expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

    public static String generateAccessToken(ResAccount resAccount){
        return Jwts.builder()
            .setSubject(String.valueOf(resAccount.getId()))
            .claim("email", resAccount.getEmail())
            .claim("nickname", resAccount.getNickname())
            .claim("avatarUrl", resAccount.getAvatarUrl())
            .claim("departmentId", resAccount.getDepartmentId())
            .claim("phoneCode", resAccount.getPhoneCode())
            .claim("phoneNumber", resAccount.getPhoneNumber())
            .claim("preferredCurrency", resAccount.getPreferredCurrency())
            .claim("createdAt", resAccount.getCreatedAt())
            .claim("deletedAt", resAccount.getDeletedAt())
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

    public static ResAccount decodeAccessToken(String token) {
        try {
            // decode JWT
            Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

            ResAccount resAccount = new ResAccount(Integer.parseInt(claims.getSubject()), (String)claims.get("email"), (String)claims.get("nickname"),
                (String)claims.get("avatarUrl"), (int)claims.get("departmentId"), (String)claims.get("phoneCode"), (String)claims.get("phoneNumber"),
                (String)claims.get("preferredCurrency"), (String)claims.get("createdAt"), (String)claims.get("deletedAt"));

            return resAccount;

        } catch (Exception e) {
            throw new RuntimeException("Token decoding failed", e);
        }
    }

    public static ResAccount decodeCookie(String cookie) {
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
