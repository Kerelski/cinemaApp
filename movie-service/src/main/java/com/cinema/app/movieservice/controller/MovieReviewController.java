package com.cinema.app.movieservice.controller;

import com.cinema.app.movieservice.dto.MovieReviewRequest;
import com.cinema.app.movieservice.dto.MovieReviewResponse;
import com.cinema.app.movieservice.service.MovieReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies/{movieId}/reviews")
@RequiredArgsConstructor
public class MovieReviewController {

    private final MovieReviewService movieReviewService;

    @GetMapping
    public List<MovieReviewResponse> getReviews(@PathVariable Long movieId) {
        return movieReviewService.getReviews(movieId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovieReviewResponse createReview(
            @PathVariable Long movieId,
            @Valid @RequestBody MovieReviewRequest request
    ) {
        return movieReviewService.createReview(movieId, request);
    }

    @PutMapping("/{reviewId}")
    public MovieReviewResponse updateReview(
            @PathVariable Long movieId,
            @PathVariable Long reviewId,
            @Valid @RequestBody MovieReviewRequest request
    ) {
        return movieReviewService.updateReview(movieId, reviewId, request);
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long movieId, @PathVariable Long reviewId) {
        movieReviewService.deleteReview(movieId, reviewId);
    }
}
