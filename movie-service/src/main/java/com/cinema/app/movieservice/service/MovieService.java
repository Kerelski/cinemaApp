package com.cinema.app.movieservice.service;

import com.cinema.app.movieservice.model.Movie;
import com.cinema.app.movieservice.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, Movie updatedMovie) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        movie.setTitle(updatedMovie.getTitle());
        movie.setDescription(updatedMovie.getDescription());
        movie.setReleaseYear(updatedMovie.getReleaseYear());
        movie.setDuration(updatedMovie.getDuration());
        movie.setDirector(updatedMovie.getDirector());
        movie.setRating(updatedMovie.getRating());
        movie.setPosterUrl(updatedMovie.getPosterUrl());
        movie.setGenres(updatedMovie.getGenres());

        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new IllegalArgumentException("Movie not found");
        }

        movieRepository.deleteById(id);
    }
}
