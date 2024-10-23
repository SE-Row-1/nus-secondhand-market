package edu.nus.market.controller;

import edu.nus.market.pojo.*;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;

import edu.nus.market.pojo.ResEntity.JWTPayload;
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
    public ResponseEntity<Object> getWishlist(@PathVariable("user_id") int userId, @CookieValue(value = "access_token", required = false) String token,
                                              @RequestParam(value = "cursor", required = false) String beforeString) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        }
        if (!JwtTokenManager.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        if (userId != JwtTokenManager.decodeAccessToken(token).getId()) {
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
    public ResponseEntity<Object> addLike(@PathVariable("user_id") int userId, @PathVariable("item_id") String itemId,
                                          @Valid @RequestBody AddLikeReq req, BindingResult bindingResult,
                                          @CookieValue(value = "access_token", required = false) String token){
        // account verification
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        JWTPayload decodedToken = JwtTokenManager.decodeAccessToken(token);
        // check userId
        if (userId != decodedToken.getId()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
        // check req.userId
        if (!Objects.equals(req.getItemId(), itemId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA.ErrorMsg));
        }

        String avatarUrl = decodedToken.getAvatarUrl();
        String nickname = decodedToken.getNickname();

        req.setUserId(userId);
        req.setNickname(nickname);
        req.setAvatarUrl(avatarUrl);

        return wishlistService.addLikeService(req);
    }

    @DeleteMapping("/{user_id}/items/{item_id}")
    public ResponseEntity<Object> deleteLike(@PathVariable("user_id") int userId, @PathVariable("item_id") String itemId,
                                             @CookieValue(value = "access_token", required = false) String token){
        // account verification
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }

        // check userId
        if (userId != JwtTokenManager.decodeAccessToken(token).getId()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }


        return wishlistService.deleteLikeService(userId, itemId);
    }

    @GetMapping("/{user_id}/items/{item_id}")
    public ResponseEntity<Object> checkLike(@PathVariable("user_id") int userId, @PathVariable("item_id") String itemId,
                                             @CookieValue(value = "access_token", required = false) String token){
        // account verification
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }

        return wishlistService.checkLikeService(itemId, userId);
    }

    @GetMapping("/statistics/{item_id}")
    public ResponseEntity<Object> getItemLikeInfo(@PathVariable("item_id") String itemId,
                                                  @CookieValue(value = "access_token", required = false) String token){
        // account verification
        if (token == null || token.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
        if (!JwtTokenManager.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }

        return wishlistService.getItemLikeInfoService(itemId, JwtTokenManager.decodeAccessToken(token).getId());
    }
}
