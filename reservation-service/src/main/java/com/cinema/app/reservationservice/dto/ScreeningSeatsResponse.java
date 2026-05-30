package com.cinema.app.reservationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreeningSeatsResponse {

    private Long screeningId;
    private int totalSeats;
    private int availableSeats;
    private int reservedSeats;
    private List<SeatInfo> seats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeatInfo {
        private String seatNumber;
        private boolean reserved;
        private String row;
        private int number;
    }
}
