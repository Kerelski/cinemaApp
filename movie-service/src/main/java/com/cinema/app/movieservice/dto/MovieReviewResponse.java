package com.cinema.app.movieservice.dto;

import com.cinema.app.movieservice.model.MovieReview;

import java.time.Instant;

public record MovieReviewResponse(
        Long id,
        Long movieId,
        Integer rating,
        String comment,
        String authorEmail,
        String authorName,
        boolean approved,
        Instant createdAt,
        Instant updatedAt
) {
    public static MovieReviewResponse from(MovieReview review) {
        return new MovieReviewResponse(
                review.getId(),
                review.getMovie().getId(),
                review.getRating(),
                review.getComment(),
                review.getAuthorEmail(),
                review.getAuthorName(),
                review.isApproved(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
