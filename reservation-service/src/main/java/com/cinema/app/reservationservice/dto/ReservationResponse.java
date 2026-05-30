package com.cinema.app.reservationservice.dto;

import com.cinema.app.reservationservice.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {

    private Long id;
    private Long screeningId;
    private Long movieId;
    private String movieTitle;
    private LocalDateTime screeningTime;
    private String room;
    private String userId;
    private String userEmail;
    private String userName;
    private List<String> seatNumbers;
    private ReservationStatus status;
    private Double totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
