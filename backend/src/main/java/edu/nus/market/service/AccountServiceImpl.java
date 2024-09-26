package edu.nus.market.service;

import edu.nus.market.Security.JwtTokenProvider;
import edu.nus.market.Security.PasswordHasher;
import edu.nus.market.Security.SaltGenerator;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.JwtBuilder;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.stream.DoubleStream;

@Service
public class AccountServiceImpl implements AccountService{

    @Resource
    AccountDao accountDao;

    @Resource
    JwtTokenProvider jwtTokenProvider;

    @Resource
    SaltGenerator saltGenerator;

    @Resource
    PasswordHasher passwordHasher;

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
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg("This email is already registered."));

        else {
            byte[] salt = saltGenerator.generateSalt();

            String passwordHash = passwordHasher.hashPassword(register,salt);

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
        return ResponseEntity.status(HttpStatus.OK).header("Set-Cookie", cookie.toString()).body(account);
        }
    }

    @Override
    public ResponseEntity<Object> deleteAccountService(DelAccReq req) {
        if(accountDao.getAccountByEmail(req.getEmail()).getId() == 0)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg("This account does not exist."));
        accountDao.deleteAccount(accountDao.getAccountByEmail(req.getEmail()).getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}

