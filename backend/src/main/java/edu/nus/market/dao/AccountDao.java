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
        "(#{email}, #{passwordHash}, #{passwordSalt}) " +
        "RETURNING id, email, nickname, avatar_url AS avatarUrl, department_id AS departmentId" +
        "phone_code AS phoneCode, phone_number AS phoneNumber, preferred_currency AS preferredCurrency" +
        "created_at AS createdAt, deleted_at AS deletedAt")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "email", column = "email"),
        @Result(property = "nickname", column = "nickname"),
        @Result(property = "avatarUrl", column = "avatarUrl"),
        @Result(property = "departmentId", column = "department_id"),
        @Result(property = "phoneCode", column = "phone_code"),
        @Result(property = "phoneNumber", column = "phone_number"),
        @Result(property = "preferredCurrency", column = "preferred_currency"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "deletedAt", column = "deleted_at")
    })
    Account registerNewAccount(Account account);

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
        "WHERE id = #{id} " +
        "RETURNING id, email, nickname, avatar_url AS avatarUrl, department_id AS departmentId" +
        "phone_code AS phoneCode, phone_number AS phoneNumber, preferred_currency AS preferredCurrency" +
        "created_at AS createdAt, deleted_at AS deletedAt")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "email", column = "email"),
        @Result(property = "nickname", column = "nickname"),
        @Result(property = "avatarUrl", column = "avatarUrl"),
        @Result(property = "departmentId", column = "department_id"),
        @Result(property = "phoneCode", column = "phone_code"),
        @Result(property = "phoneNumber", column = "phone_number"),
        @Result(property = "preferredCurrency", column = "preferred_currency"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "deletedAt", column = "deleted_at")
    })
    Account updateProfile(UpdateProfileReq updateProfileReq, int id);
}

