package edu.nus.market.Security;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class SaltGenerator {
    public byte[] generateSalt()
    {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        // depending on the length we wish
        random.nextBytes(salt);
        return salt;
    }
}
