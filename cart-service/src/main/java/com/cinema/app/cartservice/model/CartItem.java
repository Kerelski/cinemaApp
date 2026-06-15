package com.cinema.app.cartservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
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
