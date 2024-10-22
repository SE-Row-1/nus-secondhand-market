package edu.nus.market.dao;

import edu.nus.market.pojo.data.EmailTransaction;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailTransactionDao {
    // Insert into email_transaction (email, otp, created_at) VALUES (#{email}, #{otp}, now()) and return the id
    @Select("INSERT INTO email_transaction (email, otp, created_at) VALUES (#{email}, #{otp}, now()) " +
        "RETURNING id")
    int insertEmailTransaction(EmailTransaction emailTransaction);
}
