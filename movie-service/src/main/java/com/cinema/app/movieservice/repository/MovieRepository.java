package com.cinema.app.movieservice.repository;

import com.cinema.app.movieservice.model.Movie;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}