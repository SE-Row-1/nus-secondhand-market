package edu.nus.market.dao;

import edu.nus.market.pojo.data.EmailTransaction;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EmailTransactionDao {
    // Insert into email_transaction (email, otp, created_at) VALUES (#{email}, #{otp}, now()) and return the id
    @Select("INSERT INTO email_transaction (email, otp) VALUES (#{email}, #{otp}) " +
        "RETURNING id")
    UUID insertEmailTransaction(EmailTransaction emailTransaction);

    // Select the email_transaction (id, email, otp, created_at, verified_at) from email_transaction where id = #{id}
//    @Select("SELECT id, email, otp, created_at, verified_at FROM email_transaction WHERE id = #{id}")
//    EmailTransaction getEmailTransactionById(int id);
    @Select("SELECT id, email, otp, to_char(created_at, 'YYYY-MM-DD\" \"HH24:MI:SS.USOF') AS created_at, " +
        "to_char(verified_at, 'YYYY-MM-DD\" \"HH24:MI:SS.USOF') AS verified_at " +
        "FROM email_transaction WHERE id = #{id}::uuid")
    EmailTransaction getEmailTransactionById(UUID id);


    @Select("UPDATE email_transaction SET verified_at = now() WHERE id = #{id}::uuid")
    void verifyEmailTransaction(UUID id);

    // Update the created_at column of the email_transaction table
    @Select("UPDATE email_transaction SET created_at = #{time} WHERE id = #{id}::uuid")
    void updateCreatedAt(String time, UUID id);

    // clean table
    @Select("TRUNCATE TABLE email_transaction")
    void cleanTable();
}
