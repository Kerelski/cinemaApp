package com.cinema.app.reservationservice.controller;

import com.cinema.app.reservationservice.dto.ReservationRequest;
import com.cinema.app.reservationservice.dto.ReservationResponse;
import com.cinema.app.reservationservice.dto.ScreeningSeatsResponse;
import com.cinema.app.reservationservice.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestHeader(value = "X-User-Name", required = false) String userName) {
        ReservationResponse response = reservationService.createReservation(request, userId, userEmail, userName);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(reservationService.getUserReservations(userId));
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<ReservationResponse>> getUserReservationsByEmail(
            @PathVariable String email) {
        return ResponseEntity.ok(reservationService.getUserReservationsByEmail(email));
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(reservationService.cancelReservation(id, userId));
    }

    @PostMapping("/{id}/admin-cancel")
    public ResponseEntity<ReservationResponse> adminCancelReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.adminCancelReservation(id));
    }

    @GetMapping("/screenings/{screeningId}/seats")
    public ResponseEntity<ScreeningSeatsResponse> getScreeningSeats(@PathVariable Long screeningId) {
        return ResponseEntity.ok(reservationService.getScreeningSeats(screeningId));
    }

    @PostMapping("/screenings/{screeningId}/initialize")
    public ResponseEntity<Void> initializeScreeningSeats(@PathVariable Long screeningId) {
        reservationService.initializeSeatsForScreening(screeningId);
        return ResponseEntity.ok().build();
    }
}
