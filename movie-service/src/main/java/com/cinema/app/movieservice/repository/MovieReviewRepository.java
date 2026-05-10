package com.cinema.app.movieservice.repository;

import com.cinema.app.movieservice.model.MovieReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieReviewRepository extends JpaRepository<MovieReview, Long> {

    List<MovieReview> findByMovieIdOrderByCreatedAtDesc(Long movieId);
}
