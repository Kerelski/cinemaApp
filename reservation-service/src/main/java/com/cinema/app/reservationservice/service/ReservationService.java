package com.cinema.app.reservationservice.service;

import com.cinema.app.reservationservice.dto.ReservationRequest;
import com.cinema.app.reservationservice.dto.ReservationResponse;
import com.cinema.app.reservationservice.dto.ScreeningSeatsResponse;
import com.cinema.app.reservationservice.model.Reservation;
import com.cinema.app.reservationservice.model.ReservationStatus;
import com.cinema.app.reservationservice.model.Seat;
import com.cinema.app.reservationservice.repository.ReservationRepository;
import com.cinema.app.reservationservice.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final SeatRepository seatRepository;

    private static final int ROWS = 8;
    private static final int SEATS_PER_ROW = 12;

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request, String userId, String userEmail, String userName) {
        // Validate seats availability
        for (String seatNumber : request.getSeatNumbers()) {
            if (seatRepository.existsByScreeningIdAndSeatNumberAndReservedTrue(request.getScreeningId(), seatNumber)) {
                throw new IllegalStateException("Seat " + seatNumber + " is already reserved");
            }
        }

        // Initialize seats for screening if not exists
        initializeSeatsForScreening(request.getScreeningId());

        // Reserve seats
        for (String seatNumber : request.getSeatNumbers()) {
            Seat seat = seatRepository.findByScreeningIdAndSeatNumber(request.getScreeningId(), seatNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid seat: " + seatNumber));
            
            if (seat.isReserved()) {
                throw new IllegalStateException("Seat " + seatNumber + " is already reserved");
            }
        }

        // Calculate total price
        double pricePerSeat = request.getPricePerSeat() != null ? request.getPricePerSeat() : 25.0;
        double totalPrice = pricePerSeat * request.getSeatNumbers().size();

        // Create reservation
        Reservation reservation = Reservation.builder()
                .screeningId(request.getScreeningId())
                .movieId(request.getMovieId())
                .movieTitle(request.getMovieTitle())
                .screeningTime(request.getScreeningTime())
                .room(request.getRoom())
                .userId(userId)
                .userEmail(userEmail)
                .userName(userName)
                .seatNumbers(new ArrayList<>(request.getSeatNumbers()))
                .status(ReservationStatus.CONFIRMED)
                .totalPrice(totalPrice)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        // Mark seats as reserved
        for (String seatNumber : request.getSeatNumbers()) {
            Seat seat = seatRepository.findByScreeningIdAndSeatNumber(request.getScreeningId(), seatNumber)
                    .orElseThrow();
            seat.setReserved(true);
            seat.setReservationId(savedReservation.getId());
            seatRepository.save(seat);
        }

        return mapToResponse(savedReservation);
    }

    public List<ReservationResponse> getUserReservations(String userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getUserReservationsByEmail(String email) {
        return reservationRepository.findByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        return mapToResponse(reservation);
    }

    @Transactional
    public ReservationResponse cancelReservation(Long id, String userId) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        if (!reservation.getUserId().equals(userId)) {
            throw new IllegalStateException("You can only cancel your own reservations");
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new IllegalStateException("Reservation is already cancelled");
        }

        // Release seats
        List<Seat> seats = seatRepository.findByReservationId(id);
        for (Seat seat : seats) {
            seat.setReserved(false);
            seat.setReservationId(null);
            seatRepository.save(seat);
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation savedReservation = reservationRepository.save(reservation);

        return mapToResponse(savedReservation);
    }

    @Transactional
    public ReservationResponse adminCancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new IllegalStateException("Reservation is already cancelled");
        }

        // Release seats
        List<Seat> seats = seatRepository.findByReservationId(id);
        for (Seat seat : seats) {
            seat.setReserved(false);
            seat.setReservationId(null);
            seatRepository.save(seat);
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation savedReservation = reservationRepository.save(reservation);

        return mapToResponse(savedReservation);
    }

    public ScreeningSeatsResponse getScreeningSeats(Long screeningId) {
        initializeSeatsForScreening(screeningId);

        List<Seat> seats = seatRepository.findByScreeningId(screeningId);
        
        List<ScreeningSeatsResponse.SeatInfo> seatInfos = seats.stream()
                .map(seat -> {
                    String[] parts = seat.getSeatNumber().split("-");
                    return ScreeningSeatsResponse.SeatInfo.builder()
                            .seatNumber(seat.getSeatNumber())
                            .reserved(seat.isReserved())
                            .row(parts[0])
                            .number(Integer.parseInt(parts[1]))
                            .build();
                })
                .sorted(Comparator.comparing(ScreeningSeatsResponse.SeatInfo::getRow)
                        .thenComparing(ScreeningSeatsResponse.SeatInfo::getNumber))
                .collect(Collectors.toList());

        int reserved = (int) seats.stream().filter(Seat::isReserved).count();
        int total = seats.size();

        return ScreeningSeatsResponse.builder()
                .screeningId(screeningId)
                .totalSeats(total)
                .availableSeats(total - reserved)
                .reservedSeats(reserved)
                .seats(seatInfos)
                .build();
    }

    @Transactional
    public void initializeSeatsForScreening(Long screeningId) {
        List<Seat> existingSeats = seatRepository.findByScreeningId(screeningId);
        if (!existingSeats.isEmpty()) {
            return;
        }

        List<Seat> seats = new ArrayList<>();
        for (int row = 0; row < ROWS; row++) {
            char rowLetter = (char) ('A' + row);
            for (int seatNum = 1; seatNum <= SEATS_PER_ROW; seatNum++) {
                String seatNumber = rowLetter + "-" + seatNum;
                seats.add(Seat.builder()
                        .screeningId(screeningId)
                        .seatNumber(seatNumber)
                        .reserved(false)
                        .build());
            }
        }
        seatRepository.saveAll(seats);
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .screeningId(reservation.getScreeningId())
                .movieId(reservation.getMovieId())
                .movieTitle(reservation.getMovieTitle())
                .screeningTime(reservation.getScreeningTime())
                .room(reservation.getRoom())
                .userId(reservation.getUserId())
                .userEmail(reservation.getUserEmail())
                .userName(reservation.getUserName())
                .seatNumbers(reservation.getSeatNumbers())
                .status(reservation.getStatus())
                .totalPrice(reservation.getTotalPrice())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }
}
