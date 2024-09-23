package com.example.apps.controller;

import com.example.apps.dao.AccountDao;
import com.example.apps.pojo.Account;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HelloController {

    @Resource
    AccountDao accountDao;

    @GetMapping("/hello")
    public Account hello(){
        return accountDao.getAccountById(1);
    }
}
