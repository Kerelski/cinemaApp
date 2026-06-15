package com.cinema.app.cartservice.service;


import com.cinema.app.cartservice.dto.CartItemRequest;
import com.cinema.app.cartservice.model.Cart;
import com.cinema.app.cartservice.model.CartItem;
import com.cinema.app.cartservice.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public Cart getOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId)
                .orElse(Cart.builder().userId(userId).build());
    }

    public Cart addItemToCart(String userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        boolean itemExists = cart.getItems().stream()
                .anyMatch(item -> Objects.equals(item.getSeatNumber(), request.getSeatNumber())
                        && Objects.equals(item.getScreeningId(), request.getScreeningId()));

        if (!itemExists) {
            CartItem newItem = CartItem.builder()
                    .screeningId(request.getScreeningId())
                    .seatId(request.getSeatId())
                    .seatNumber(request.getSeatNumber())
                    .movieId(request.getMovieId())
                    .movieTitle(request.getMovieTitle())
                    .moviePosterUrl(request.getMoviePosterUrl())
                    .screeningTime(request.getScreeningTime())
                    .room(request.getRoom())
                    .price(request.getPrice())
                    .build();

            cart.getItems().add(newItem);
            cartRepository.save(cart);
        }

        return cart;
    }

    public Cart removeItemFromCart(String userId, Long screeningId, String seatNumber) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> Objects.equals(item.getScreeningId(), screeningId)
                && Objects.equals(item.getSeatNumber(), seatNumber));
        cartRepository.save(cart);
        return cart;
    }

    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
    }
}
