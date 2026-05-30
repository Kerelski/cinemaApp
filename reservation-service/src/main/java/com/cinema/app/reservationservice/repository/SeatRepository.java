package com.cinema.app.reservationservice.repository;

import com.cinema.app.reservationservice.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByScreeningId(Long screeningId);

    Optional<Seat> findByScreeningIdAndSeatNumber(Long screeningId, String seatNumber);

    List<Seat> findByScreeningIdAndReservedFalse(Long screeningId);

    List<Seat> findByScreeningIdAndReservedTrue(Long screeningId);

    List<Seat> findByReservationId(Long reservationId);

    boolean existsByScreeningIdAndSeatNumberAndReservedTrue(Long screeningId, String seatNumber);

    int countByScreeningIdAndReservedFalse(Long screeningId);

    int countByScreeningIdAndReservedTrue(Long screeningId);

    void deleteByScreeningId(Long screeningId);
}
