package edu.nus.market.service;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.Account;
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