package edu.nus.market.service;

import edu.nus.market.Security.JwtTokenProvider;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.JwtBuilder;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.Objects;
import java.util.stream.DoubleStream;

@Service
public class AccountServiceImpl implements AccountService{

    @Resource
    AccountDao accountDao;

    @Resource
    JwtTokenProvider jwtTokenProvider;

    @Override
    public Account getMyAccount(int id) {
        return accountDao.getAccountById(id);
    }



    @Override
    public ResponseEntity loginService(LoginReq loginReq){
        Account account = accountDao.getAccountByEmail(loginReq.getEmail());
        if(account == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg("This account does not exist."));
        else{
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(loginReq.getPassword() + account.getPasswordSalt(), account.getPasswordHash())){
                return ResponseEntity.status(HttpStatus.OK).body(account);
            }
            else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg("Wrong password. Please try again."));
            }
        }
    }

    @Override
    public ResponseEntity<Object> registerService(Register register){


        if(accountDao.getAccountByEmail(register.getEmail()) != null)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg("This email is already registered."));

        else {
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[16];
            // depending on the length we wish
            random.nextBytes(salt);
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String passwordHash = passwordEncoder.encode(register.getPassword() + Base64.getEncoder().encodeToString(salt));
            Account account = new Account(register);
            account.setPasswordHash(passwordHash);
            account.setPasswordSalt(Base64.getEncoder().encodeToString(salt));
            int accountId = accountDao.addNewAccount(account);

            String accessToken = jwtTokenProvider.generateAccessToken(String.valueOf(accountId));
            ResponseCookie cookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)         // 1 week
                .sameSite("Strict")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).header("Set-Cookie", cookie.toString()).body(account);
        }
    }
}

