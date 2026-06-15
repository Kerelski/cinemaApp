package com.cinema.app.cartservice.controller;

import com.cinema.app.cartservice.dto.CartItemRequest;
import com.cinema.app.cartservice.model.Cart;
import com.cinema.app.cartservice.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(cartService.getOrCreateCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(userId, request));
    }

    @DeleteMapping("/items")
    public ResponseEntity<Cart> removeItem(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam Long screeningId,
            @RequestParam String seatNumber) {
        return ResponseEntity.ok(cartService.removeItemFromCart(userId, screeningId, seatNumber));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Id") String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
