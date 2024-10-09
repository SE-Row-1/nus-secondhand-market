package edu.nus.market.service;

import org.springframework.http.ResponseEntity;

public interface WishlistService {
    ResponseEntity<Object> getFavorlistService(int i);
}
