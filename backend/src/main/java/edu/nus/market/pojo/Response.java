package edu.nus.market.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response {

    int code;
    String errorMessage;
    Object attached;

    public Response(ResponseCode code, Object attached){
        this.code = code.code;
        this.errorMessage = code.msg;
        this.attached = attached;
    }

}
