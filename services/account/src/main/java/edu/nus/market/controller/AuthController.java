package edu.nus.market.controller;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.*;
import edu.nus.market.pojo.ResEntity.EmailMessage;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.data.EmailTransaction;
import edu.nus.market.security.CookieManager;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.security.OTPGenerator;
import edu.nus.market.service.AccountService;
import edu.nus.market.service.EmailValidationService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Resource
    AccountDao accountDao;

    @Resource
    AccountService accountService;

    @Resource
    EmailValidationService emailValidationService;

    @Resource
    EmailTransactionDao emailTransactionDao;

    @Resource
    OTPGenerator otpGenerator;

    @Resource
    CookieManager cookieManager;

    // Get Account Info
    @GetMapping("/me")
    public ResponseEntity<Object> getAccount(@CookieValue(value = "access_token", required = false) String token){
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        return accountService.getAccountService(JwtTokenManager.decodeAccessToken(token).getId());
    }

    //Updating Account
    @PutMapping("/me/password")
    public ResponseEntity<Object> updateAccountPsw(@Valid @RequestBody UpdPswReq req, BindingResult bindingResult, @CookieValue(value = "access_token", required = false) String token){
        if (token == null || token.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        }
        if (!JwtTokenManager.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).header("Set-Cookie", cookieManager.deleteCookie().toString()).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }

        int userId = JwtTokenManager.decodeAccessToken(token).getId();
        if (accountDao.getAccountById(userId).equals(null)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).header("Set-Cookie", cookieManager.deleteCookie().toString()).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return accountService.updatePasswordService(req, JwtTokenManager.decodeAccessToken(token).getId());
    }

    // Login and Logout
    @PostMapping("/token")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginReq loginReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return accountService.loginService(loginReq);
    }

    @DeleteMapping("/token")
    public ResponseEntity<Object> logout(@RequestHeader(value = "Cookie") String token){
        return accountService.logoutService();
    }

    //Forgot password and reset without Login
    @PostMapping("/reset-password")
    public ResponseEntity<Object> resetPassword(@Valid @RequestBody ForgetPasswordReq forgotPasswordReq, BindingResult bindingResult){
        //forget password and reset
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return accountService.forgetPasswordService(forgotPasswordReq);
    }

    // otp sending and validation
    @PostMapping("/otp")
    public ResponseEntity<Object> sendOtp(@Valid @RequestBody EmailOTPReq emailOTPReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return emailValidationService.sendOTP(emailOTPReq);
    }

    // use this to help test sending opt
    @PostMapping("/otp/test")
    public ResponseEntity<Object> sendOtpTest(@Valid @RequestBody EmailOTPReq emailOTPReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        String email = emailOTPReq.getEmail();
        String type = emailOTPReq.getType();
        //
        Account account = accountDao.getAccountByEmail(email);
        // for register and update_email, check if the email is not registered
        if (type.equals("register") || type.equals("update_email")){
            if (account != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));
        }
        // for reset password, check if the email exists
        else if (type.equals("reset_password")){
            if (account == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        }
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));

        String otp = otpGenerator.generateOTP(6);
        EmailMessage message = new EmailMessage(email, "Your Verification Code", "Your verification code is: " + otp);



        UUID id = emailTransactionDao.insertEmailTransaction(new EmailTransaction(email, otp));

        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    @PostMapping("/otp/verification")
    public ResponseEntity<Object> validateOtp(@Valid @RequestBody EmailOTPValidationReq emailOTPValidationReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return emailValidationService.validateOTP(emailOTPValidationReq);
    }

    // Health Check
    @GetMapping("/healthz")
    public String checkHealth(){
        return "ok";
    }

}
