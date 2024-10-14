package edu.nus.market;

import edu.nus.market.security.CookieManager;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;

import static org.junit.jupiter.api.Assertions.*;

public class CookieManagerTest {

    @Test
    void generateCookieTest() {
        String accessToken = "sampleAccessToken";

        ResponseCookie cookie = CookieManager.generateCookie(accessToken);

        assertEquals("access_token", cookie.getName());
        assertEquals(accessToken, cookie.getValue());
        assertTrue(cookie.isHttpOnly());
        assertEquals("/", cookie.getPath());
        assertEquals(7 * 24 * 60 * 60, cookie.getMaxAge().getSeconds());
        assertEquals("Lax", cookie.getSameSite());
    }

    @Test
    void deleteCookieTest() {
        ResponseCookie cookie = CookieManager.deleteCookie();

        assertEquals("access_token", cookie.getName());
        assertEquals("", cookie.getValue());
        assertTrue(cookie.isHttpOnly());
        assertEquals("/", cookie.getPath());
        assertEquals(0, cookie.getMaxAge().getSeconds());
        assertEquals("Lax", cookie.getSameSite());
    }
}
