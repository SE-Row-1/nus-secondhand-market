package edu.nus.market.SecurityTests;

import edu.nus.market.pojo.ReqEntity.*;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class ValidationTest {

    private Validator validator;

    private UUID uuid = UUID.randomUUID();

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void validLoginReq() {
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("test@u.nus.edu");
        loginReq.setPassword("password");

        Set<ConstraintViolation<LoginReq>> violations = validator.validate(loginReq);

        assertTrue(violations.isEmpty()); // No violations
    }

    @Test
    public void invalidEmailLoginReq() {
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("test@");
        loginReq.setPassword("password");

        Set<ConstraintViolation<LoginReq>> violations = validator.validate(loginReq);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(1, violations.size());

        for (ConstraintViolation<LoginReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }

    @Test
    public void invalidPasswordLoginReq() {
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("test@u.nus.edu");
        loginReq.setPassword("password toooooo loooong");

        Set<ConstraintViolation<LoginReq>> violations = validator.validate(loginReq);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(1, violations.size());

        for (ConstraintViolation<LoginReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }

    @Test
    public void invalidEmailAndPasswordLoginReq() {
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("");
        loginReq.setPassword("");
        // invalid email and password, password should not be blank, so it will violate both constraints

        Set<ConstraintViolation<LoginReq>> violations = validator.validate(loginReq);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(4, violations.size());

        for (ConstraintViolation<LoginReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }

    @Test
    public void validRegisterReq() {
        RegisterReq registerReq = new RegisterReq();
        registerReq.setId(uuid);
        registerReq.setPassword("password");

        Set<ConstraintViolation<RegisterReq>> violations = validator.validate(registerReq);

        assertTrue(violations.isEmpty()); // No violations
    }

    @Test
    public void invalidPasswordRegisterReq() {
        RegisterReq registerReq = new RegisterReq();
        registerReq.setId(uuid);
        registerReq.setPassword("password toooooo loooong");

        Set<ConstraintViolation<RegisterReq>> violations = validator.validate(registerReq);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(1, violations.size());

        for (ConstraintViolation<RegisterReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }

    @Test
    public void validForgetPswReq() {
        ForgetPasswordReq forgetPasswordReq = new ForgetPasswordReq();
        forgetPasswordReq.setId(uuid);
        forgetPasswordReq.setNewPassword("password");

        Set<ConstraintViolation<ForgetPasswordReq>> violations = validator.validate(forgetPasswordReq);

        assertTrue(violations.isEmpty()); // No violations
    }

    @Test
    public void invalidEmailForgetPswReq() {
        ForgetPasswordReq forgetPasswordReq = new ForgetPasswordReq();
        forgetPasswordReq.setId(null);
        forgetPasswordReq.setNewPassword("password");

        Set<ConstraintViolation<ForgetPasswordReq>> violations = validator.validate(forgetPasswordReq);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(1, violations.size());

        for (ConstraintViolation<ForgetPasswordReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }

    @Test
    public void invalidPasswordForgetPswReq() {
        ForgetPasswordReq forgetPasswordReq = new ForgetPasswordReq();
        forgetPasswordReq.setId(uuid);
        forgetPasswordReq.setNewPassword("");

        Set<ConstraintViolation<ForgetPasswordReq>> violations = validator.validate(forgetPasswordReq);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(2, violations.size());

        for (ConstraintViolation<ForgetPasswordReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }

    @Test
    public void validUpdPswReq() {
        UpdPswReq updPswReq = new UpdPswReq();
        updPswReq.setOldPassword("test@u.nus.edu");
        updPswReq.setNewPassword("password");

        Set<ConstraintViolation<UpdPswReq>> violations = validator.validate(updPswReq);

        assertTrue(violations.isEmpty()); // No violations
    }

    @Test
    public void invalidOldPasswordUpdPswReq() {
        UpdPswReq updPswReq = new UpdPswReq();
        updPswReq.setOldPassword("");
        updPswReq.setNewPassword("password");

        Set<ConstraintViolation<UpdPswReq>> violations = validator.validate(updPswReq);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(2, violations.size());

        for (ConstraintViolation<UpdPswReq> violation : violations) {
           System.out.println(violation.getMessage());
        }
    }

    @Test
    public void invalidNewPasswordUpdPswReq() {
        UpdPswReq updPswReq = new UpdPswReq();
        updPswReq.setOldPassword("test@u.nus.edu");
        updPswReq.setNewPassword("");

        Set<ConstraintViolation<UpdPswReq>> violations = validator.validate(updPswReq);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(2, violations.size());
    }

    @Test
    public void validAccountUpdateProfileReq() {
        UpdateProfileReq req = new UpdateProfileReq();
        req.setId(uuid);
        req.setNickname("TestUser");
        req.setAvatarUrl("http://avatar.url");
        req.setPhoneCode("65");
        req.setPhoneNumber("12345678");
        req.setPreferredCurrency("SGD");
        req.setDepartmentId(1);

        Set<ConstraintViolation<UpdateProfileReq>> violations = validator.validate(req);

        assertTrue(violations.isEmpty()); // No violations
    }

    @Test
    public void invalidNicknameUpdateProfileReq() {
        UpdateProfileReq req = new UpdateProfileReq();
        req.setId(uuid);
        req.setNickname("A"); // Too short, should fail (less than 2 characters)
        req.setPhoneCode("65");
        req.setPhoneNumber("12345678");

        Set<ConstraintViolation<UpdateProfileReq>> violations = validator.validate(req);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(1, violations.size()); // Expecting only 1 violation for nickname

        for (ConstraintViolation<UpdateProfileReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }

    @Test
    public void invalidPhoneUpdateProfileReq() {
        UpdateProfileReq req = new UpdateProfileReq();
        req.setId(uuid);
        req.setNickname("TestUser");
        req.setPhoneCode("abc"); // Should only contain numbers
        req.setPhoneNumber("123abc"); // Should only contain numbers

        Set<ConstraintViolation<UpdateProfileReq>> violations = validator.validate(req);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(2, violations.size()); // Expecting 2 violations for phoneCode and phoneNumber

        for (ConstraintViolation<UpdateProfileReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }

    @Test
    public void emptyEmailAndInvalidNicknameUpdateProfileReq() {
        UpdateProfileReq req = new UpdateProfileReq();
        req.setId(null);
        req.setNickname(""); // Too short nickname
        req.setPhoneCode("65");
        req.setPhoneNumber("12345678");

        Set<ConstraintViolation<UpdateProfileReq>> violations = validator.validate(req);

        assertFalse(violations.isEmpty()); // There should be violations
        assertEquals(1, violations.size()); // Expecting 2 violations for email and nickname

        for (ConstraintViolation<UpdateProfileReq> violation : violations) {
            System.out.println(violation.getMessage());
        }
    }
}
