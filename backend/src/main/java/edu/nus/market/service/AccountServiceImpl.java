package edu.nus.market.service;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class AccountServiceImpl implements AccountService{

    @Resource
    AccountDao accountDao;

    @Override
    public Account getMyAccount(int id) {
        return accountDao.getAccountById(id);
    }

    @Override
    public Response loginService(LoginReq req){
        return new Response(ResponseCode.OK, null);
    }

    @Override
    public ResponseEntity<Object> registerService(Register register){
        if(accountDao.getAccountByEmail(register.getEmail()) != null)
            ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg("This email is already registered."));

        else {
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[16];
            // depending on the length we wish
            random.nextBytes(salt);
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String passwordHash = passwordEncoder.encode(register.getPassword() + Base64.getEncoder().encodeToString(salt));
            register.setPassword(passwordHash);
            return ResponseEntity.status(HttpStatus.OK).body(register);
        }
        return ResponseEntity.status(HttpStatus.OK).body(register);
    };
}
