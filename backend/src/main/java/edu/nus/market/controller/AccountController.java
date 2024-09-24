package edu.nus.market.controller;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.Account;
import edu.nus.market.service.AccountService;
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
