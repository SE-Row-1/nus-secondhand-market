package edu.nus.market.dao;

import edu.nus.market.pojo.Account;
import edu.nus.market.pojo.Register;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountDao {
    @Select("SELECT uid,uname FROM account WHERE id = #{id}")
    Account getAccountById(int id);

    @Select("SELECT email FROM account WHERE email = #{email}")
    Account getAccountByEmail(String email);

    @Insert("INSERT INTO account VALUE (email}, nickname, .avatar_url, depart_Id, password_hash, " +
        "password_salt, phone, preferred_currency) " +
        "(#{account.email}, #{account.nickname}, #{account.avatarUrl}, #{account.departId}, " +
        "#{account.passwordHash}, #{account.passwordSalt}, #{account.phone}, #{account.preferredCurrency})")
    void addNewAccount(Account account);

    @Select("SELECT * FROM accounts WHERE id = #{id}")
    Account findById(Long id);

    @Insert("INSERT INTO accounts (username, password) VALUES (#{username}, #{password})")
    void insertAccount(Account account);
}
