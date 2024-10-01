package edu.nus.market.service;
import edu.nus.market.pojo.rspEntity.RspAccount;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.security.PasswordHasher;
import edu.nus.market.security.SaltGenerator;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
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
    JwtTokenManager jwtTokenManager;

    @Resource
    SaltGenerator saltGenerator;

    @Resource
    PasswordHasher passwordHasher;

    /**
     *
     * @param id
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity<Object> getMyAccount(int id) {
        Account account = accountDao.getAccountById(id);
        if (account == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        RspAccount rspAccount = new RspAccount(account);
        return ResponseEntity.status(HttpStatus.OK).body(rspAccount);
    }

    /**
     *
     * @param
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity<Object> logoutService(String token){
        ResponseCookie cookie = ResponseCookie.from("access_token", null)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(0)         // delete immediately
            .sameSite("Strict")
            .build();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).header("Cookie", cookie.toString()).build();
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
                String accessToken = jwtTokenManager.generateAccessToken((account.getId()));
                ResponseCookie cookie = ResponseCookie.from("access_token", accessToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)         // 1 week
                    .sameSite("Strict")
                    .build();
                // generate the JWTaccesstoken and send it to the frontend
                return ResponseEntity.status(HttpStatus.CREATED).header("Cookie", cookie.toString()).body(new RspAccount(account));
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
            int accountId = accountDao.registNewAccount(account);

            String accessToken = jwtTokenManager.generateAccessToken((accountId));
            ResponseCookie cookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)         // 1 week
                .sameSite("Strict")
                .build();
            // generate the JWTaccesstoken and send it to the frontend
        return ResponseEntity.status(HttpStatus.CREATED).header("Cookie", cookie.toString()).body(new RspAccount(account));
        }
    }

    @Override
    public ResponseEntity<Object> deleteAccountService(DelAccReq req, int id) {
        //Check if account exists
        if(accountDao.getAccountById(id) == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));

        //delete account
        accountDao.deleteAccount(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Override
    public ResponseEntity<Object> updatePasswordService(UpdPswReq req, int id) {// Update Password
        Account account = accountDao.getAccountById(id);// Get Account
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
        return ResponseEntity.status(HttpStatus.OK).body(new RspAccount(account));

    }

    public ResponseEntity<Object> updateProfileService( UpdateProfileReq req, int id) {
        // Business logic to update nickname, avatar, phone in the database
        // Use repository or DAO to interact with the database.
        int updateProfileResult = accountDao.updateProfile(req.getNickname(), req.getAvatar(), req.getPhoneCode(), req.getPhoneNumber()
            , req.getCurrency(), id);

        if (updateProfileResult > 0) {
            return ResponseEntity.status(HttpStatus.OK).body(req);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorMsg("Failed to update profile"));
        }
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
