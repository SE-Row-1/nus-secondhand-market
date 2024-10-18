package edu.nus.market.SecurityTests;

import edu.nus.market.pojo.ResEntity.JWTPayload;
import edu.nus.market.security.JwtTokenManager;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class JwtTokenManagerTest {

    @InjectMocks
    private JwtTokenManager jwtTokenManager;

    @Value("${jwt.secretKey}")
    private String secretKey;

    private JWTPayload jwtPayload;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        jwtPayload = new JWTPayload();
        jwtPayload.setId(1);
        jwtPayload.setNickname("JohnDoe");
        jwtPayload.setAvatarUrl("http://example.com/avatar");
    }

    @Test
    public void testGenerateAccessToken() {
        String token = JwtTokenManager.generateAccessToken(jwtPayload);
        assertNotNull(token);

        // Verify token structure
        Claims claims = Jwts.parser()
            .setSigningKey(secretKey)
            .parseClaimsJws(token)
            .getBody();

        assertEquals(1, claims.get("id"));
        assertEquals("JohnDoe", claims.get("nickname"));
        assertEquals("http://example.com/avatar", claims.get("avatar_url"));
        assertNotNull(claims.getExpiration());
    }

    @Test
    public void testValidateToken_ValidToken() {
        String token = JwtTokenManager.generateAccessToken(jwtPayload);
        assertTrue(JwtTokenManager.validateToken(token));
    }

    @Test
    public void testValidateToken_ExpiredToken() {
        String expiredToken = Jwts.builder()
            .setSubject("1")
            .claim("nickname", "JohnDoe")
            .claim("avatar_url", "http://example.com/avatar")
            .setIssuedAt(new Date(System.currentTimeMillis() - 1000))  // 1 second before
            .setExpiration(new Date(System.currentTimeMillis() - 500))  // Already expired
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();

        assertFalse(JwtTokenManager.validateToken(expiredToken));
    }

    @Test
    public void testDecodeAccessToken() {
        String token = JwtTokenManager.generateAccessToken(jwtPayload);
        JWTPayload decodedPayload = JwtTokenManager.decodeAccessToken(token);

        assertEquals(jwtPayload.getId(), decodedPayload.getId());
        assertEquals(jwtPayload.getNickname(), decodedPayload.getNickname());
        assertEquals(jwtPayload.getAvatarUrl(), decodedPayload.getAvatarUrl());
    }

    @Test
    public void testDecodeCookie_ValidCookie() {
        String token = JwtTokenManager.generateAccessToken(jwtPayload);
        String cookie = "access_token=" + token + "; Path=/; HttpOnly";

        JWTPayload decodedPayload = JwtTokenManager.decodeCookie(cookie);

        assertEquals(jwtPayload.getId(), decodedPayload.getId());
        assertEquals(jwtPayload.getNickname(), decodedPayload.getNickname());
        assertEquals(jwtPayload.getAvatarUrl(), decodedPayload.getAvatarUrl());
    }

    @Test
    public void testDecodeCookie_InvalidCookie() {
        String invalidCookie = "invalid_token; Path=/; HttpOnly";

        assertThrows(IllegalArgumentException.class, () -> {
            JwtTokenManager.decodeCookie(invalidCookie);
        });
    }

    @Test
    public void testGenerateSecretKey() {
        String secretKey = JwtTokenManager.generateSecretKey();
        assertNotNull(secretKey);
        assertEquals(44, secretKey.length());  // Base64 encoded string length
    }
}
