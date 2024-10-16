package edu.nus.market.controller;

import edu.nus.market.dao.AccountDao;

import edu.nus.market.pojo.*;
import edu.nus.market.pojo.ReqEntity.*;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accounts")

public class AccountController {

    @Resource
    AccountDao accountDao;

    @Resource
    AccountService accountService;

    // Register and Delete
    @PostMapping("")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterReq registerReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return accountService.registerService(registerReq);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteAccount(@PathVariable int id, @RequestHeader(value = "Cookie", required = false) String token){
        if (token == null || token.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        }
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        int userId = JwtTokenManager.decodeCookie(token).getId();
        if (userId != id){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        return accountService.deleteAccountService(id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Object> updateProfile(@PathVariable int id, @Valid @RequestBody UpdateProfileReq req, BindingResult bindingResult, @RequestHeader(value = "Cookie", required = false) String token){
        if (token == null || token.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        }
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        int userId = JwtTokenManager.decodeCookie(token).getId();
        if (userId != id){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        return accountService.updateProfileService(req, id);
    }

    // get account info automatically
    @GetMapping("/{id}")
    public ResponseEntity<Object> getSpecificAccount(@PathVariable int id){
        return accountService.getAccountService(id);
    }
}
