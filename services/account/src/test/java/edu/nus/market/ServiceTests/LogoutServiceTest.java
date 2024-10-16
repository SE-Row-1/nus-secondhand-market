package edu.nus.market.ServiceTests;

import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class LogoutServiceTest {
    @Resource
    AccountService accountService;

    @Test
    void logoutSuccessTest() {

        ResponseEntity<Object> response = accountService.logoutService();

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        String setCookieHeader = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertEquals("access_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax", setCookieHeader);
    }

}
