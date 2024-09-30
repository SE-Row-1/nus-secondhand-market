package edu.nus.market.dao;

import edu.nus.market.pojo.Account;

import org.apache.ibatis.annotations.*;
import org.apache.ibatis.annotations.Select;

import org.springframework.stereotype.Repository;


@Repository
public interface AccountDao {
    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE id = #{id}")
    Account getAccountById(int id);

    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE email = #{email}")
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

    @Update("UPDATE account SET password_hash = #{passwordHash}, password_salt = #{passwordSalt} WHERE id = #{id}" +
        "RETURNING id")
    int updatePassword(int id, String passwordHash, String passwordSalt);

    @Update("UPDATE account SET nickname = #{nickname}, avatar_url = #{avatar}, phone = #{phone}, preferred_currency = #{currency} WHERE id = #{id}" +
        "RETURNING id")
    int updateProfile(String nickname, String avatar, String phone, String currency, int id);
}

