package edu.nus.market.controller;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.*;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.AccountService;
import edu.nus.market.service.EmailValidationService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Resource
    AccountDao accountDao;

    @Resource
    AccountService accountService;

    @Resource
    EmailValidationService emailValidationService;

    // Get Account Info
    @GetMapping("/me")
    public ResponseEntity<Object> getAccount(@RequestHeader(value = "Cookie", required = false) String token){
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        return accountService.getAccountService(JwtTokenManager.decodeCookie(token).getId());
    }

    //Updating Account password
    @PutMapping("/me/password")
    public ResponseEntity<Object> updateAccountPsw(@Valid @RequestBody UpdPswReq req, BindingResult bindingResult, @RequestHeader(value = "Cookie", required = false) String token){
        if (token == null || token.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        }
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return accountService.updatePasswordService(req, JwtTokenManager.decodeCookie(token).getId());
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
    @PatchMapping("/reset-password")
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
        System.out.println("U have successfully get to OTP!");
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }

        return emailValidationService.sendOTP(emailOTPReq.getEmail());
    }

    // Health Check
    @GetMapping("/healthz")
    public String checkHealth(){
        return "ok";
    }

}
