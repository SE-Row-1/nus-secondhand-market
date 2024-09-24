package edu.nus.market.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response {

    int code;
    String errorMessage;
    Object t;

    public Response(ResponseCode code, Object t){
        this.code = code.code;
        this.errorMessage = code.msg;
        this.t = t;
    }

}
