package edu.nus.market.service;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.EmailOTPReq;
import edu.nus.market.pojo.ResEntity.EmailMessage;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.data.EmailTransaction;
import edu.nus.market.security.OTPGenerator;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class EmailValidationServiceImpl implements EmailValidationService{

    private static final long expirationTime = 10 * 60 * 1000; // 10 min

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
            if (account != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));
        }
        // for reset password, check if the email exists
        else if (type.equals("reset_password")){
            if (account == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));
        }
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));

        String otp = otpGenerator.generateOTP(6);
        EmailMessage message = new EmailMessage(email, "Your Verification Code", "Your verification code is: " + otp);
        mqService.sendEmailMessage(message);

        int id = emailTransactionDao.insertEmailTransaction(new EmailTransaction(email, otp));

        return ResponseEntity.ok(id);
    }

    @Override
    public ResponseEntity<Object> validateOTP(String email, String otp) {
        // TODO: validate OTP
        return null;
    }



}
