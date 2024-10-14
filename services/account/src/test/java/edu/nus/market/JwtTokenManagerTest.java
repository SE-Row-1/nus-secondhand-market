package edu.nus.market;

import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.security.JwtTokenManager;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class JwtTokenManagerTest {

    private JwtTokenManager jwtTokenManager;

    @Value("${jwt.secretKey}")
    private String secretKey;

    private ResAccount resAccount;

    @BeforeEach
    void setUp() {
        jwtTokenManager = new JwtTokenManager(secretKey);

        resAccount = new ResAccount();
        resAccount.setId(1);
        resAccount.setEmail("e1351826@u.nus.edu");
        resAccount.setNickname("John Doe");
        resAccount.setAvatarUrl("http://example.com/avatar");
        resAccount.setDepartmentId(123);
        resAccount.setPhoneCode("65");
        resAccount.setPhoneNumber("12345678");
        resAccount.setPreferredCurrency("SGD");
        resAccount.setCreatedAt("2024-01-01");
        resAccount.setDeletedAt(null);
    }

    @Test
    void testGenerateAccessToken() {
        String token = JwtTokenManager.generateAccessToken(resAccount);
        assertNotNull(token);

        assertTrue(JwtTokenManager.validateToken(token));

        ResAccount decodedAccount = JwtTokenManager.decodeAccessToken(token);
        assertEquals(resAccount.getId(), decodedAccount.getId());
        assertEquals(resAccount.getEmail(), decodedAccount.getEmail());
        assertEquals(resAccount.getNickname(), decodedAccount.getNickname());
        assertEquals(resAccount.getAvatarUrl(), decodedAccount.getAvatarUrl());
        assertEquals(resAccount.getDepartmentId(), decodedAccount.getDepartmentId());
        assertEquals(resAccount.getPhoneCode(), decodedAccount.getPhoneCode());
        assertEquals(resAccount.getPhoneNumber(), decodedAccount.getPhoneNumber());
        assertEquals(resAccount.getPreferredCurrency(), decodedAccount.getPreferredCurrency());
        assertEquals(resAccount.getCreatedAt(), decodedAccount.getCreatedAt());
        assertNull(decodedAccount.getDeletedAt());
    }

    @Test
    void testValidateToken() {
        String token = JwtTokenManager.generateAccessToken(resAccount);

        assertTrue(JwtTokenManager.validateToken(token));

        String expiredToken = Jwts.builder()
            .setSubject(String.valueOf(resAccount.getId()))
            .setIssuedAt(new Date())
            .setExpiration(new Date(new Date().getTime() - 1000)) // make the time expired
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();

        assertFalse(JwtTokenManager.validateToken(expiredToken));
    }

    @Test
    void testDecodeAccessToken() {
        String token = JwtTokenManager.generateAccessToken(resAccount);

        ResAccount decodedAccount = JwtTokenManager.decodeAccessToken(token);

        assertEquals(resAccount.getId(), decodedAccount.getId());
        assertEquals(resAccount.getEmail(), decodedAccount.getEmail());
        assertEquals(resAccount.getNickname(), decodedAccount.getNickname());
    }

    @Test
    void testDecodeCookie() {
        String token = JwtTokenManager.generateAccessToken(resAccount);

        String cookie = "access_token=" + token + "; Path=/; HttpOnly";

        ResAccount decodedAccount = JwtTokenManager.decodeCookie(cookie);
        assertEquals(resAccount.getId(), decodedAccount.getId());
        assertEquals(resAccount.getEmail(), decodedAccount.getEmail());
    }
}
