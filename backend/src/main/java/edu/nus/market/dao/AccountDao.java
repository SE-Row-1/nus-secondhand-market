package edu.nus.market.dao;

import edu.nus.market.pojo.Account;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountDao {
    @Select("SELECT uid,uname FROM account WHERE id = #{id}")
    Account getAccountById(int id);


    int addNewAccount(Account account);
}
