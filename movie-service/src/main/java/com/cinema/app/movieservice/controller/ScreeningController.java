package com.cinema.app.movieservice.controller;

import com.cinema.app.movieservice.dto.MovieWithScreeningsResponse;
import com.cinema.app.movieservice.dto.ScreeningRequest;
import com.cinema.app.movieservice.dto.ScreeningResponse;
import com.cinema.app.movieservice.service.ScreeningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies/screenings")
@RequiredArgsConstructor
public class ScreeningController {

    private final ScreeningService screeningService;

    @GetMapping
    public ResponseEntity<List<ScreeningResponse>> getAllScreenings() {
        return ResponseEntity.ok(screeningService.getAllScreenings());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ScreeningResponse>> getUpcomingScreenings() {
        return ResponseEntity.ok(screeningService.getUpcomingScreenings());
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ScreeningResponse>> getScreeningsByMovieId(@PathVariable Long movieId) {
        return ResponseEntity.ok(screeningService.getScreeningsByMovieId(movieId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScreeningResponse> getScreeningById(@PathVariable Long id) {
        return ResponseEntity.ok(screeningService.getScreeningById(id));
    }

    @PostMapping
    public ResponseEntity<ScreeningResponse> createScreening(@Valid @RequestBody ScreeningRequest request) {
        ScreeningResponse response = screeningService.createScreening(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScreeningResponse> updateScreening(
            @PathVariable Long id,
            @Valid @RequestBody ScreeningRequest request) {
        return ResponseEntity.ok(screeningService.updateScreening(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScreening(@PathVariable Long id) {
        screeningService.deleteScreening(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<String>> getAllRooms() {
        return ResponseEntity.ok(screeningService.getAllRooms());
    }

    @GetMapping("/with-movies")
    public ResponseEntity<List<MovieWithScreeningsResponse>> getMoviesWithUpcomingScreenings() {
        return ResponseEntity.ok(screeningService.getMoviesWithUpcomingScreenings());
    }
}
