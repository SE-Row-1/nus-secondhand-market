package edu.nus.market.pojo;

public enum ResponseCode {


    OK(0,"success"),
    EROOR(3000,"ERROR");


    public int code;
    public String msg;
    ResponseCode(int code, String msg){
        this.code = code;
        this.msg = msg  ;
    }

}
