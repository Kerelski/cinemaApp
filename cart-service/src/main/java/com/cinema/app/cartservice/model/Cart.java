package com.cinema.app.cartservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {
    private String userId;

    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    private Double totalPrice;

    public Double getTotalPrice() {
        if (items == null) return 0.0;
        return items.stream()
                .mapToDouble(CartItem::getPrice)
                .sum();
    }
}