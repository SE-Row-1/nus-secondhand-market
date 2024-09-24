package com.example.apps.service;

import com.example.apps.dao.AccountDao;
import com.example.apps.pojo.Account;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService{

    @Resource
    AccountDao accountDao;

    @Override
    public Account getMyAccount(int id) {
        return accountDao.getAccountById(id);
    }
}
