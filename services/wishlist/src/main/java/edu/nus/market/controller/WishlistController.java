package edu.nus.market.controller;

import edu.nus.market.pojo.*;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;

import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.WishlistService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;


@RestController
@RequestMapping("/wishlists")

public class WishlistController {


    @Resource
    WishlistService wishlistService;

    @GetMapping("")
    //helloworld
    public String helloWorld(){
        return "Hello World";
    }


    // Register and Delete
    @GetMapping("/{user_id}")
    public ResponseEntity<Object> getWishlist(@PathVariable("user_id") int userId, @RequestHeader(value = "Cookie", required = false) String token,
                                              @RequestParam(value = "before", required = false) String beforeString) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        }
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        if (userId != JwtTokenManager.decodeCookie(token).getId()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        Date before = new Date();
        if (beforeString != null && !beforeString.isEmpty()) {
            try{
                beforeString = beforeString.replace(" ", "+");
                before = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").parse(beforeString);
            }
            catch (ParseException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA.ErrorMsg));
            }
        }

        return wishlistService.getWishlistService(userId, before);
    }

    @PostMapping("/{user_id}/items/{item_id}")
    public ResponseEntity<Object> addLike(@PathVariable("user_id") int userId, @PathVariable("item_id") String itemId, @Valid @RequestBody AddLikeReq req, BindingResult bindingResult, @RequestHeader(value = "Cookie", required = false) String token){
        // account verification
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }

        // check userId
        if (userId != JwtTokenManager.decodeCookie(token).getId()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        // check req.userId
        if (!Objects.equals(req.getItemId(), itemId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA.ErrorMsg));
        }

        req.setUserId(userId);
        return wishlistService.addLikeService(req);
    }

    @DeleteMapping("/{user_id}/items/{item_id}")
    public ResponseEntity<Object> deleteLike(@PathVariable("user_id") int userId, @PathVariable("item_id") String itemId, @RequestHeader(value = "Cookie", required = false) String token){
        // account verification
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }

        // check userId
        if (userId != JwtTokenManager.decodeCookie(token).getId()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        // check req.userId

        return wishlistService.deleteLikeService(userId, itemId);
    }

    @GetMapping("/statistics/{item_id}")
    public ResponseEntity<Object> getItemLikeInfo(@PathVariable("item_id") String itemId, @RequestHeader(value = "Cookie", required = false) String token){
        // account verification
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateCookie(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }

        return wishlistService.getItemLikeInfo(itemId);
    }
}
