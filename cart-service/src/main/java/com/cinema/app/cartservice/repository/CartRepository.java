package com.cinema.app.cartservice.repository;

import com.cinema.app.cartservice.model.Cart;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Repository
public class CartRepository {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String KEY_PREFIX = "cinema:cart:";
    private static final long CART_TTL_MINUTES = 10;

    public CartRepository(RedisTemplate<String, String> redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public void save(Cart cart) {
        String key = KEY_PREFIX + cart.getUserId();
        try {
            String jsonValue = objectMapper.writeValueAsString(cart);
            redisTemplate.opsForValue().set(key, jsonValue);
            redisTemplate.expire(key, CART_TTL_MINUTES, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Błąd podczas serializacji koszyka do JSON", e);
        }
    }

    public Optional<Cart> findByUserId(String userId) {
        String key = KEY_PREFIX + userId;
        String jsonValue = redisTemplate.opsForValue().get(key);

        if (jsonValue == null) {
            return Optional.empty();
        }

        try {
            Cart cart = objectMapper.readValue(jsonValue, Cart.class);
            return Optional.of(cart);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Błąd podczas deserializacji koszyka z JSON", e);
        }
    }

    public void deleteByUserId(String userId) {
        String key = KEY_PREFIX + userId;
        redisTemplate.delete(key);
    }
}