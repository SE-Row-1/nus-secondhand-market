package edu.nus.market.dao;

import edu.nus.market.pojo.Account;

import edu.nus.market.pojo.Register;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.annotations.Select;

import org.springframework.stereotype.Repository;


@Repository
public interface AccountDao {
    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone_code, phone_number, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE id = #{id}")
    Account getAccountById(int id);

    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone_code, phone_number, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE email = #{email}")
    Account getAccountByEmail(String email);

    @Insert("INSERT INTO account (email, password_hash, password_salt) VALUES " +
        "(#{email}, #{passwordHash}, #{passwordSalt}) RETURNING id")
    int registNewAccount(Account account);

    @Delete("DELETE FROM account WHERE id = #{id}")
    void deleteAccount(int id);

    @Update("UPDATE account SET password_hash = #{passwordHash}, password_salt = #{passwordSalt} WHERE id = #{id}" +
        "RETURNING id")
    int updatePassword(int id, String passwordHash, String passwordSalt);

    @Update("UPDATE account SET nickname = #{nickname}, avatar_url = #{avatar}, phone_code = #{phoneCode}, phone_number = #{phoneNumber}, preferred_currency = #{currency} WHERE id = #{id}" +
        "RETURNING id")
    int updateProfile(String nickname, String avatar, String phoneCode, String phone_number, String currency, int id);
}

