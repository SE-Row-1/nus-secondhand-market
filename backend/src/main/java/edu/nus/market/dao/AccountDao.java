package com.example.apps.dao;

import com.example.apps.pojo.Account;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

@Repository
public interface AccountDao {
    @Select("SELECT uid,uname FROM account where id = #{id}")
    Account getAccountById(int id);

    @
    int addNewAccount(Account account);
}
