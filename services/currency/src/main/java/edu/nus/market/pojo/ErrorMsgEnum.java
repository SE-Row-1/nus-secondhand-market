package edu.nus.market.pojo;

public enum ErrorMsgEnum {
    INVALID_DATA_FORMAT("Invalid data format."),
    REGISTERED_EMAIL("This email is already registered."),
    WRONG_PASSWORD("Wrong password. Please try again."),
    ACCOUNT_NOT_FOUND("This account does not exist.")
    ;
    public String ErrorMsg;

    ErrorMsgEnum(String msg){
        this.ErrorMsg = msg  ;
    }
}
