package com.cinema.app.cartservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CartItemRequest {
    private Long screeningId;
    private Long seatId;
    private String seatNumber;
    private Long movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private LocalDateTime screeningTime;
    private String room;
    private Double price;
}
