package com.example.apps.controller;

import com.example.apps.dao.AccountDao;
import com.example.apps.pojo.Account;
import com.example.apps.service.AccountService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AccountController {

    @Resource
    AccountDao accountDao;

    @Resource
    AccountService accountService;

    @PutMapping("/account")
    public Account updatePassword(){
        //update
        return null;
    }


    @GetMapping("/account")
    public Account getMyProfile(){
        return accountService.getMyAccount(1);
    }


    @PostMapping("/login")
    public Account login(@RequestBody Account account){
        //accountService.login();
        return accountDao.getAccountById(1);
    }

    @PostMapping("/account")
    public Account register(){
        return null;
    }
}
