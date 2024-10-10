package edu.nus.market.controller;

import edu.nus.market.dao.WishlistDao;

import edu.nus.market.pojo.*;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.WishlistService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")

public class WishlistController {


    @Resource
    WishlistService wishlistService;

    @GetMapping("")
    //helloworld
    public String helloWorld(){
        return "Hello World";
    }


    // Register and Delete
    @GetMapping("/me")
//    public ResponseEntity<Object> getFavorlist(@RequestParam("id") int id){
    public ResponseEntity<Object> getWishlist(@RequestHeader(value = "Cookie", required = false) String token){
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        int id = JwtTokenManager.decodeCookie(token);
        return wishlistService.getWishlistService(id);
    }

    @PostMapping("/me")
    public ResponseEntity<Object> addLike(@RequestBody AddLikeReq req){
//    public ResponseEntity<Object> addLike(@RequestBody AddLikeReq req, @RequestHeader(value = "Cookie", required = false) String token){
//        if (token == null || token.isEmpty())
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
//        if (!JwtTokenManager.validateCookie(token)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
//        }
//        int id = JwtTokenManager.decodeCookie(token);
//        req.setUserId(id);
        return wishlistService.addLikeService(req);
    }
}
