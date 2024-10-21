package edu.nus.market.service;
import edu.nus.market.pojo.ReqEntity.*;
import edu.nus.market.pojo.ResEntity.JWTPayload;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.security.CookieManager;
import edu.nus.market.security.JwtTokenManager;
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
    JwtTokenManager jwtTokenManager;

    @Resource
    SaltGenerator saltGenerator;

    @Resource
    PasswordHasher passwordHasher;

    @Resource
    CookieManager cookieManager;

    /**
     *
     * @param id
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity<Object> getAccountService(int id) {
        Account account = accountDao.getAccountById(id);
        if (account == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        ResAccount resAccount = new ResAccount(account);
        return ResponseEntity.status(HttpStatus.OK).body(resAccount);
    }

    /**
     *
     * @param registerReq
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity<Object> registerService(RegisterReq registerReq){
        // we should check all the emails in this case, no matter if it is deleted or not
        Account checkAccount = accountDao.getAccountByEmailAll(registerReq.getEmail());
        if(checkAccount != null) {
            if (checkAccount.getDeletedAt() == null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));
            // if the account is soft-deleted, we need to hard-delete it and register a new one
            accountDao.hardDeleteAccount(checkAccount.getId());
        }

        byte[] salt = saltGenerator.generateSalt();
        String passwordHash = passwordHasher.hashPassword(registerReq.getPassword(),salt);
        // generate salt and hash the password
        Account account = new Account(registerReq);
        account.setPasswordHash(passwordHash);
        account.setPasswordSalt(Base64.getEncoder().encodeToString(salt));
        account = accountDao.registerNewAccount(account);

        String accessToken = jwtTokenManager.generateAccessToken(new JWTPayload(account));
        ResponseCookie cookie = cookieManager.generateCookie(accessToken);
        // generate the JWTaccesstoken and send it to the frontend
        return ResponseEntity.status(HttpStatus.CREATED).header("Set-Cookie", cookie.toString()).body(new ResAccount(account));
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
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (passwordEncoder.matches(loginReq.getPassword() + account.getPasswordSalt(), account.getPasswordHash())){
            String accessToken = jwtTokenManager.generateAccessToken(new JWTPayload(account));
            ResponseCookie cookie = cookieManager.generateCookie(accessToken);
            // generate the JWTaccesstoken and send it to the frontend
            return ResponseEntity.status(HttpStatus.CREATED).header("Set-Cookie", cookie.toString()).body(new ResAccount(account));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg));
    }

    /**
     *
     * @param
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity<Object> logoutService(){
        ResponseCookie cookie = cookieManager.deleteCookie();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).header("Set-Cookie", cookie.toString()).build();
    }

    @Override
    public ResponseEntity<Object> updateProfileService(UpdateProfileReq updateProfileReq, int id) {
        // Business logic to update nickname, avatar, phone in the database
        // Use repository or DAO to interact with the database.
        Account account = accountDao.getAccountById(id);
        if (account == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        }

        if (updateProfileReq.getEmail() != null){
            // we should check all the emails in this case, no matter if it is deleted or not
            Account checkAccount = accountDao.getAccountByEmailAll(updateProfileReq.getEmail());
            if(checkAccount != null) {
                if (checkAccount.getDeletedAt() == null)
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));
                // if the account is soft-deleted, we need to hard-delete it and register a new one
                accountDao.hardDeleteAccount(checkAccount.getId());
            }
        }

        account = accountDao.updateProfile(updateProfileReq, id);

        return ResponseEntity.status(HttpStatus.OK).body(new ResAccount(account));

    }

    @Override
    public ResponseEntity<Object> deleteAccountService(int id) {
        //Check if account exists
        if(accountDao.getAccountById(id) == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        //delete account
        accountDao.softDeleteAccount(id);
        ResponseCookie cookie = cookieManager.deleteCookie();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).header("Set-Cookie", cookie.toString()).build();
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
        return ResponseEntity.status(HttpStatus.OK).body(new ResAccount(account));

    }

    /**
     *
     * @param forgetPasswordReq
     * @return ResponseEntity
     * @author jyf
     */
    @Override
    public ResponseEntity<Object> forgetPasswordService(ForgetPasswordReq forgetPasswordReq){
        Account account = accountDao.getAccountByEmail(forgetPasswordReq.getEmail());
        if(account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        }
        // TODO: use email to do verification

        byte[] salt = saltGenerator.generateSalt();
        String passwordHash = passwordHasher.hashPassword(forgetPasswordReq.getNewPassword(),salt);
        // generate salt and hash the password
        int accountId = accountDao.updatePassword(account.getId(), passwordHash, Base64.getEncoder().encodeToString(salt));
        return ResponseEntity.status(HttpStatus.OK).body("");
    }
}
