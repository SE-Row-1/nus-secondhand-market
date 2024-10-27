package edu.nus.market.service;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.EmailOTPReq;
import edu.nus.market.pojo.ReqEntity.EmailOTPValidationReq;
import edu.nus.market.pojo.ResEntity.EmailMessage;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.data.EmailTransaction;
import edu.nus.market.security.OTPGenerator;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class EmailValidationServiceImpl implements EmailValidationService{

    private static final long expirationTime = 10 * 60 * 1000; // 10 min

    private static Logger logger = LoggerFactory.getLogger(EmailValidationServiceImpl.class);

    @Resource
    private OTPGenerator otpGenerator;

    @Resource
    MQService mqService;

    @Resource
    EmailTransactionDao emailTransactionDao;

    @Resource
    AccountDao accountDao;

    @Override
    public ResponseEntity<Object> sendOTP(EmailOTPReq emailOTPReq) {
        String email = emailOTPReq.getEmail();
        String type = emailOTPReq.getType();
        //
        Account account = accountDao.getAccountByEmail(email);
        // for register and update_email, check if the email is not registered
        if (type.equals("register") || type.equals("update_email")){
            if (account != null){
                logger.info("Email already registered");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));
            }
        }
        // for reset password, check if the email exists
        else if (type.equals("reset_password")){
            if (account == null) {
                logger.info("Email not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
            }
        }
        else {
            logger.info("Invalid type");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        logger.info("Email check passed.");

        String otp = otpGenerator.generateOTP(6);
        EmailMessage message = new EmailMessage(email, "Your Verification Code", "Your verification code is: " + otp);
        mqService.sendEmailMessage(message);
        logger.info("Send message successfully.");

        UUID id = emailTransactionDao.insertEmailTransaction(new EmailTransaction(email, otp));
        logger.info("Insert email transaction successfully.");

        return ResponseEntity.ok(id);
    }

    @Override
    public ResponseEntity<Object> validateOTP(EmailOTPValidationReq emailOTPValidationReq) {
        logger.info("Receive validation req: " + emailOTPValidationReq);

        // select the email transaction by id
        EmailTransaction emailTransaction = emailTransactionDao.getEmailTransactionById(emailOTPValidationReq.getId());
        if (emailTransaction == null) {
            logger.info("Email transaction not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.TRANSACTION_NOT_FOUND.ErrorMsg));
        }
        // if the email is verified
        if (emailTransaction.getVerifiedAt() != null) {
            logger.info("Email already verified");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.EMAIL_VERIFIED.ErrorMsg));
        }
        // if the time is expired
        String time = emailTransaction.getCreatedAt();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSSX");
        OffsetDateTime createdTime = OffsetDateTime.parse(emailTransaction.getCreatedAt(), formatter);
        OffsetDateTime now = OffsetDateTime.now();
        if (now.isAfter(createdTime.plus(expirationTime, ChronoUnit.MILLIS))) {
            logger.info("OTP expired");
            return ResponseEntity.status(HttpStatus.GONE).body(new ErrorMsg(ErrorMsgEnum.OTP_EXPIRED.ErrorMsg));
        }
        // if the otp is incorrect
        if (!emailOTPValidationReq.getOtp().equals(emailTransaction.getOtp())){
            logger.info("Invalid OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.INVALID_OTP.ErrorMsg));
        }
        emailTransactionDao.verifyEmailTransaction(emailOTPValidationReq.getId());
        logger.info("Verify email transaction successfully.");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
