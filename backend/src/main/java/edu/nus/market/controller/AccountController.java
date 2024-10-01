package edu.nus.market.controller;

import edu.nus.market.dao.AccountDao;

import edu.nus.market.pojo.*;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")

public class AccountController {

    @Resource
    AccountDao accountDao;

    @Resource
    AccountService accountService;

    @PostMapping("/token")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginReq loginReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return accountService.loginService(loginReq);
    }

    @DeleteMapping("/token")
    public ResponseEntity<Object> logout(@RequestHeader(value = "Cookie") String token){
        return accountService.logoutService(token);
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getAccount(@RequestHeader(value = "Cookie", required = false) String token){
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        return accountService.getMyAccount(JwtTokenManager.decodeCookie(token));
    }

    @PostMapping("/me")
    public ResponseEntity<Object> register(@Valid @RequestBody Register register, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return accountService.registerService(register);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Object> deleteAccount(@Valid @RequestBody DelAccReq req, BindingResult bindingResult, @RequestHeader("Cookie") String token){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        //System.out.println(JwtTokenManager.decodeAccessToken(token));
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        return accountService.deleteAccountService(req, JwtTokenManager.decodeCookie(token));
    }

    @PatchMapping("/me/profile")
    public ResponseEntity<Object> updateProfile(@Valid @RequestBody UpdateProfileReq req, BindingResult bindingResult, @RequestHeader("Cookie") String token){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        return accountService.updateProfileService(req, JwtTokenManager.decodeCookie(token));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Object> updateAccountPsw(@Valid @RequestBody UpdPswReq req, BindingResult bindingResult, @RequestHeader("Cookie") String token){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        return accountService.updatePasswordService(req, JwtTokenManager.decodeCookie(token));
    }


    @PatchMapping("/me/reset-password")
    public ResponseEntity<Object> resetPassword(@Valid @RequestBody ForgotPasswordReq forgotPasswordReq, BindingResult bindingResult){
        //forget password and reset
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return accountService.forgotPasswordService(forgotPasswordReq);
    }

    @GetMapping("/health")
    public String checkHealth(){
        return "ok";
    }

}
