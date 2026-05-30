package com.cinema.app.reservationservice.repository;

import com.cinema.app.reservationservice.model.Reservation;
import com.cinema.app.reservationservice.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Reservation> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Reservation> findByScreeningId(Long screeningId);

    List<Reservation> findByScreeningIdAndStatus(Long screeningId, ReservationStatus status);

    List<Reservation> findByStatus(ReservationStatus status);

    List<Reservation> findAllByOrderByCreatedAtDesc();

    boolean existsByScreeningIdAndSeatNumbersContaining(Long screeningId, String seatNumber);
}
