package edu.nus.market.pojo;

public enum ResponseCode {


    OK(0,"success"),
    EROOR(3000,"ERROR"),
    EMAIL_REGISTERED(3001, "This email is already registered");


    public int code;
    public String msg;
    ResponseCode(int code, String msg){
        this.code = code;
        this.msg = msg  ;
    }

}
