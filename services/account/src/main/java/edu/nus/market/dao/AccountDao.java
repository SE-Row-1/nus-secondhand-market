package edu.nus.market.dao;

import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.ReqEntity.UpdateProfileReq;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountDao {
    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone_code, phone_number, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE id = #{id} AND deleted_at IS NULL")
    Account getAccountById(int id);

    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone_code, phone_number, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE email = #{email}")
    Account getAccountByEmailAll(String email);

    @Select("SELECT id, email, nickname, avatar_url, department_id, password_hash, password_salt, phone_code, phone_number, preferred_currency, " +
        "created_at, deleted_at FROM account WHERE email = #{email} AND deleted_at IS NULL")
    Account getAccountByEmail(String email);

    @Select("INSERT INTO account (email, password_hash, password_salt) VALUES " +
        "(#{email}, #{passwordHash}, #{passwordSalt}) " +
        "RETURNING id, email, nickname, avatar_url AS avatarUrl, department_id AS departmentId, " +
        "phone_code AS phoneCode, phone_number AS phoneNumber, preferred_currency AS preferredCurrency, " +
        "created_at AS createdAt, deleted_at AS deletedAt")
    Account registerNewAccount(Account account);

    @Delete("DELETE FROM account WHERE id = #{id}")
    void hardDeleteAccount(int id);

    @Update("UPDATE account SET deleted_at = now() WHERE id = #{id}")
    void softDeleteAccount(int id);

    @Update("UPDATE account SET password_hash = #{passwordHash}, password_salt = #{passwordSalt} WHERE id = #{id} AND deleted_at IS NULL " +
        "RETURNING id")
    int updatePassword(int id, String passwordHash, String passwordSalt);

    @Select("UPDATE account SET " +
        "email = COALESCE(#{updateProfileReq.email}, email), " +
        "nickname = COALESCE(#{updateProfileReq.nickname}, nickname), " +
        "avatar_url = COALESCE(#{updateProfileReq.avatarUrl}, avatar_url), " +
        "phone_code = COALESCE(#{updateProfileReq.phoneCode}, phone_code), " +
        "phone_number = COALESCE(#{updateProfileReq.phoneNumber}, phone_number), " +
        "preferred_currency = COALESCE(#{updateProfileReq.preferredCurrency}, preferred_currency), " +
        "department_id = COALESCE(#{updateProfileReq.departmentId}, department_id) " +
        "WHERE id = #{id} " +
        "RETURNING id, email, nickname, avatar_url AS avatarUrl, department_id AS departmentId, " +
        "phone_code AS phoneCode, phone_number AS phoneNumber, preferred_currency AS preferredCurrency, " +
        "created_at AS createdAt, deleted_at AS deletedAt"
    )
    Account updateProfile(UpdateProfileReq updateProfileReq, int id);

    // clean table everytime before and after test
    @Delete("TRUNCATE TABLE account")
    void cleanTable();

    // delete account by email
    @Delete("DELETE FROM account WHERE email = #{email}")
    void hardDeleteAccountByEmail(String email);

    @Update("UPDATE account SET deleted_at = now() WHERE email = #{email}")
    void softDeleteAccountByEmail(String email);
}

