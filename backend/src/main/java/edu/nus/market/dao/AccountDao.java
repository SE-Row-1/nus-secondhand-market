package edu.nus.market.dao;

import edu.nus.market.pojo.Account;
import edu.nus.market.pojo.UpdateProfileReq;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountDao {
    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone_code, phone_number, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE id = #{id} AND deleted_at IS NULL")
    Account getAccountById(int id);

    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone_code, phone_number, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE email = #{email} AND deleted_at IS NULL")
    Account getAccountByEmail(String email);

    @Insert("INSERT INTO account (email, password_hash, password_salt) VALUES " +
        "(#{email}, #{passwordHash}, #{passwordSalt}) RETURNING id")
    int registerNewAccount(Account account);

    @Delete("UPDATE FROM account WHERE id = #{id}")
    void hardDeleteAccount(int id);

    @Update("UPDATE account SET deleted_at = now() WHERE id = #{id}")
    void deleteAccount(int id);

    @Update("UPDATE account SET password_hash = #{passwordHash}, password_salt = #{passwordSalt} WHERE id = #{id} AND deleted_at IS NULL " +
        "RETURNING id")
    int updatePassword(int id, String passwordHash, String passwordSalt);

    @Update("UPDATE account SET " +
        "email = COALESCE(#{updateProfileReq.email}, email), " +
        "nickname = COALESCE(#{updateProfileReq.nickname}, nickname), " +
        "avatar_url = COALESCE(#{updateProfileReq.avatarUrl}, avatar_url), " +
        "phone_code = COALESCE(#{updateProfileReq.phoneCode}, phone_code), " +
        "phone_number = COALESCE(#{updateProfileReq.phoneNumber}, phone_number), " +
        "preferred_currency = COALESCE(#{updateProfileReq.preferredCurrency}, preferred_currency), " +
        "department_id = COALESCE(#{updateProfileReq.departmentId}, department_id) " +
        "WHERE id = #{id} ")
    int updateProfile(UpdateProfileReq updateProfileReq, int id);
    @Update("UPDATE account SET nickname = #{nickname}, avatar_url = #{avatar}, phone_code = #{phoneCode}, phone_number = #{phoneNumber}, preferred_currency = #{currency} WHERE id = #{id} AND deleted_at IS NULL " +
        "RETURNING id")
    int updateProfile(String nickname, String avatar, String phoneCode, String phoneNumber, String currency, int id);
}

