package com.cinema.app.reservationservice.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class ReservationRequest {

    @NotNull(message = "Screening ID is required")
    private Long screeningId;

    @NotNull(message = "Movie ID is required")
    private Long movieId;

    private String movieTitle;

    private LocalDateTime screeningTime;

    private String room;

    private Double pricePerSeat;

    @NotEmpty(message = "At least one seat must be selected")
    private List<String> seatNumbers;
}
