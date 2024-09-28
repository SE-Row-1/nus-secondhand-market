package edu.nus.market.service;

import edu.nus.market.security.JwtTokenProvider;
import edu.nus.market.security.PasswordHasher;
import edu.nus.market.security.SaltGenerator;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Base64;

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


    /**
     *
     * @param loginReq
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity loginService(LoginReq loginReq){
        Account account = accountDao.getAccountByEmail(loginReq.getEmail());
        if(account == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        else{
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(loginReq.getPassword() + account.getPasswordSalt(), account.getPasswordHash())){
                return ResponseEntity.status(HttpStatus.OK).body(account);
            }
            else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg));
            }
        }
    }

    /**
     *
     * @param register
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity<Object> registerService(Register register){
        if(accountDao.getAccountByEmail(register.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));
        }
        else {
            byte[] salt = saltGenerator.generateSalt();
            String passwordHash = passwordHasher.hashPassword(register.getPassword(),salt);
            // generate salt and hash the password
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
            // generate the JWTaccesstoken and send it to the frontend
        return ResponseEntity.status(HttpStatus.CREATED).header("Set-Cookie", cookie.toString()).body(account);
        }
    }

    @Override
    public ResponseEntity<Object> deleteAccountService(DelAccReq req) {
        //Check if account exists
        if(accountDao.getAccountByEmail(req.getEmail()) == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));

        //delete account
        accountDao.deleteAccount(accountDao.getAccountByEmail(req.getEmail()).getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Override
    public ResponseEntity<Object> updatePasswordService(UpdPswReq req) {// Update Password
        Account account = accountDao.getAccountByEmail(req.getEmail());// Get Account
        //Check if account exists
        if(account == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));

        //check if old password matches
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(req.getOldPassword() + account.getPasswordSalt(), account.getPasswordHash()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg));

        //generate new salt & hash
        byte[] salt = saltGenerator.generateSalt();
        String passwordHash = passwordHasher.hashPassword(req.getNewPassword(), salt);
        //update account
        accountDao.updatePassword(account.getId(), passwordHash, Base64.getEncoder().encodeToString(salt));
        return ResponseEntity.status(HttpStatus.OK).body(account);

    }

    /**
     *
     * @param forgotPasswordReq
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity<Object> forgotPasswordService(ForgotPasswordReq forgotPasswordReq){
        Account account = accountDao.getAccountByEmail(forgotPasswordReq.getEmail());
        if(account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        }
        else{
            // TODO: use email to do verification

            byte[] salt = saltGenerator.generateSalt();
            String passwordHash = passwordHasher.hashPassword(forgotPasswordReq.getNewPassword(),salt);
            // generate salt and hash the password
            int accountId = accountDao.updatePassword(account.getId(), passwordHash, Base64.getEncoder().encodeToString(salt));
            return ResponseEntity.status(HttpStatus.OK).body("");
        }

    }
}

