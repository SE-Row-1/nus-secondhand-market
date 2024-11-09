package edu.nus.currency.security;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieManager {

    public static ResponseCookie generateCookie(String accessToken){
        ResponseCookie cookie = ResponseCookie.from("access_token", accessToken)
            .httpOnly(true)
            .path("/")
            .maxAge(7 * 24 * 60 * 60)
            .sameSite("Lax")
            .build();
        return cookie;
    }
    public static ResponseCookie deleteCookie(){
        ResponseCookie cookie = ResponseCookie.from("access_token", null)
            .httpOnly(true)
            .path("/")
            .maxAge(0)
            .sameSite("Lax")
            .build();
        return cookie;
    }
}


