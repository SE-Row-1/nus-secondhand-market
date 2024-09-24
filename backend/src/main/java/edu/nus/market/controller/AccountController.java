package edu.nus.market.controller;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
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

    @PutMapping("/account")
    public Account updatePassword(){
        //update
        return null;
    }


    @GetMapping("/account")
    public Account getMyProfile(){
        return accountService.getMyAccount(1);
    }


    @PostMapping("/me")
    public Response login(@RequestBody LoginReq req){
        return  new Response(ResponseCode.OK,req);
    }

    @PostMapping("/account")
    public Account register(){
        return null;
    }
}
