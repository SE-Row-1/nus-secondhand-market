package edu.nus.market.controller;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import edu.nus.market.service.AccountService;
import edu.nus.market.service.AccountServiceImpl;
import jakarta.annotation.Resource;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AccountController {

    @Resource
    AccountDao accountDao;

    @Resource
    AccountService accountService;

    @PutMapping("/me")
    public Account updatePassword(){
        //update
        return null;
    }


    @GetMapping("/me")
    public Account getMyProfile(){
        return accountService.getMyAccount(1);
    }


    @PostMapping("/token")
    public Response login(@RequestBody LoginReq req){
        return accountService.loginService(req);
    }

    @PostMapping("/me")
    public ResponseEntity<Object> register(@RequestBody Register register){
        return accountService.registerService(register);
    }
}
