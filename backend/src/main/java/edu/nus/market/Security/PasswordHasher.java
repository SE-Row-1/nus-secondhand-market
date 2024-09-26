package edu.nus.market.Security;

import edu.nus.market.pojo.Register;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class PasswordHasher {

    public String hashPassword(Register register, byte[] salt){

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String passwordHash = passwordEncoder.encode(register.getPassword() + Base64.getEncoder().encodeToString(salt));

        return passwordHash;
    }

}
