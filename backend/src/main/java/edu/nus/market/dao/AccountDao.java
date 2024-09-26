package edu.nus.market.dao;

import edu.nus.market.pojo.Account;
import edu.nus.market.pojo.Register;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountDao {
    @Select("SELECT id,nickname FROM account WHERE id = #{id}")
    Account getAccountById(int id);

    @Select("SELECT email FROM account WHERE email = #{email}")
    Account getAccountByEmail(String email);

    @Insert("INSERT INTO account (email, nickname, avatar_url, department_Id, password_hash, password_salt, phone, preferred_currency) VALUES  " +
        "(#{email}, #{nickname}, #{avatarUrl}, #{departmentId}, #{passwordHash}, #{passwordSalt}, #{phone}, #{preferredCurrency}) " +
        "RETURNING id")
    int addNewAccount(Account account);

    @Select("SELECT * FROM account WHERE id = #{id}")
    Account findById(Long id);

    @Insert("INSERT INTO account (username, password) VALUES (#{username}, #{password})")
    void insertAccount(Account account);

    @Delete("DELETE FROM account WHERE id = #{id}")
    void deleteAccount(int id);
}
