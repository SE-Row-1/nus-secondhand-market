package edu.nus.market.pojo;

public enum ErrorMsgEnum {
    INVALID_DATA_FORMAT("Invalid data format."),
    REGISTERED_EMAIL("This email is already registered."),
    WRONG_PASSWORD("Wrong password. Please try again."),
    ACCOUNT_NOT_FOUND("This account does not exist."),
    INVALID_INPUT("The input value is invalid"),
    THIRD_PARTY_API_ERROR("Third party service not available"),
    RECORD_NOT_FOUND("Record not found"),
    ;
    public String ErrorMsg;

    ErrorMsgEnum(String msg){
        this.ErrorMsg = msg  ;
    }
}
