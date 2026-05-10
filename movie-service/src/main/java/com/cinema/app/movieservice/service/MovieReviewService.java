package com.cinema.app.movieservice.service;

import com.cinema.app.movieservice.dto.MovieReviewRequest;
import com.cinema.app.movieservice.dto.MovieReviewResponse;
import com.cinema.app.movieservice.model.Movie;
import com.cinema.app.movieservice.model.MovieReview;
import com.cinema.app.movieservice.repository.MovieRepository;
import com.cinema.app.movieservice.repository.MovieReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieReviewService {

    private final MovieRepository movieRepository;
    private final MovieReviewRepository movieReviewRepository;

    public List<MovieReviewResponse> getReviews(Long movieId) {
        ensureMovieExists(movieId);
        return movieReviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId).stream()
                .map(MovieReviewResponse::from)
                .toList();
    }

    public MovieReviewResponse createReview(Long movieId, MovieReviewRequest request) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        MovieReview review = MovieReview.builder()
                .movie(movie)
                .rating(request.rating())
                .comment(request.comment())
                .authorEmail(request.authorEmail().toLowerCase())
                .authorName(request.authorName())
                .approved(request.approved() == null || request.approved())
                .build();

        return MovieReviewResponse.from(movieReviewRepository.save(review));
    }

    public MovieReviewResponse updateReview(Long movieId, Long reviewId, MovieReviewRequest request) {
        ensureMovieExists(movieId);
        MovieReview review = findReviewForMovie(movieId, reviewId);

        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setAuthorEmail(request.authorEmail().toLowerCase());
        review.setAuthorName(request.authorName());
        review.setApproved(request.approved() == null || request.approved());
        review.setUpdatedAt(Instant.now());

        return MovieReviewResponse.from(movieReviewRepository.save(review));
    }

    public void deleteReview(Long movieId, Long reviewId) {
        ensureMovieExists(movieId);
        MovieReview review = findReviewForMovie(movieId, reviewId);
        movieReviewRepository.delete(review);
    }

    private MovieReview findReviewForMovie(Long movieId, Long reviewId) {
        MovieReview review = movieReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (!review.getMovie().getId().equals(movieId)) {
            throw new IllegalArgumentException("Review not found for this movie");
        }

        return review;
    }

    private void ensureMovieExists(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new IllegalArgumentException("Movie not found");
        }
    }
}
