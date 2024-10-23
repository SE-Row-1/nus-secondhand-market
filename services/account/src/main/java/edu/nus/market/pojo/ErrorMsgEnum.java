package edu.nus.market.pojo;

public enum ErrorMsgEnum {
    INVALID_DATA_FORMAT("Invalid data format."),
    REGISTERED_EMAIL("This email is already registered."),
    WRONG_PASSWORD("Wrong password. Please try again."),
    ACCOUNT_NOT_FOUND("This account does not exist."),
    UNAUTHORIZED_ACCESS("Token validation failed."),
    NOT_LOGGED_IN("Please log in first."),
    FAILED_UPDATE("Failed to update profile."),
    ACCESS_FORBIDDEN("You are not allowed to access this resource."),

    TRANSACTION_NOT_FOUND("Transaction not found."),
    EMAIL_NOT_MATCHED("Email not matched."),
    EMAIL_VERIFIED("Email has been verified."),
    OTP_EXPIRED("OTP has expired."),
    INVALID_OTP("Invalid OTP."),
    ;
    public String ErrorMsg;

    ErrorMsgEnum(String msg){
        this.ErrorMsg = msg  ;
    }
}
