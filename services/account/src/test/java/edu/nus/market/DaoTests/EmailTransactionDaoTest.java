package edu.nus.market.DaoTests;

import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.data.EmailTransaction;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class EmailTransactionDaoTest {

    @Resource
    private EmailTransactionDao emailTransactionDao;

    private UUID transactionId;

    @BeforeAll
    public void setup() {
        // 插入测试记录
        EmailTransaction transaction = new EmailTransaction();
        transaction.setEmail("test@u.nus.edu");
        transaction.setOtp("123456");
        transactionId = emailTransactionDao.insertEmailTransaction(transaction);
    }

    @Test
    public void testInsertEmailTransaction() {
        assertNotNull(transactionId, "Transaction ID should not be null");
    }

    @Test
    public void testGetEmailTransactionById() {
        EmailTransaction transaction = emailTransactionDao.getEmailTransactionById(transactionId);
        assertNotNull(transaction, "Transaction should not be null");
        assertEquals("test@u.nus.edu", transaction.getEmail(), "Email should match");
        assertEquals("123456", transaction.getOtp(), "OTP should match");
    }

    @Test
    public void testUpdateCreatedAt() {
        String newTime = "2023-01-01 00:00:00.000000+00";
        emailTransactionDao.updateCreatedAt(newTime, transactionId);
        EmailTransaction updatedTransaction = emailTransactionDao.getEmailTransactionById(transactionId);
        assertEquals(newTime, updatedTransaction.getCreatedAt(), "Created time should be updated");
    }

    @Test
    public void testVerifyEmailTransaction() {
        emailTransactionDao.verifyEmailTransaction(transactionId);
        EmailTransaction verifiedTransaction = emailTransactionDao.getEmailTransactionById(transactionId);
        assertNotNull(verifiedTransaction.getVerifiedAt(), "VerifiedAt should not be null");
    }

    @AfterAll
    public void cleanUp() {
        // 清理测试数据
        emailTransactionDao.cleanTable();
    }
}

