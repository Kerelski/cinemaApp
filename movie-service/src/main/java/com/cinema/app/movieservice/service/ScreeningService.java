package com.cinema.app.movieservice.service;

import com.cinema.app.movieservice.dto.MovieWithScreeningsResponse;
import com.cinema.app.movieservice.dto.ScreeningRequest;
import com.cinema.app.movieservice.dto.ScreeningResponse;
import com.cinema.app.movieservice.model.Genre;
import com.cinema.app.movieservice.model.Movie;
import com.cinema.app.movieservice.model.Screening;
import com.cinema.app.movieservice.repository.MovieRepository;
import com.cinema.app.movieservice.repository.ScreeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;

    public List<ScreeningResponse> getAllScreenings() {
        return screeningRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ScreeningResponse> getUpcomingScreenings() {
        return screeningRepository.findUpcomingScreenings(LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ScreeningResponse> getScreeningsByMovieId(Long movieId) {
        return screeningRepository.findUpcomingScreeningsByMovieId(movieId, LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ScreeningResponse getScreeningById(Long id) {
        Screening screening = screeningRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found"));
        return mapToResponse(screening);
    }

    @Transactional
    public ScreeningResponse createScreening(ScreeningRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        Screening screening = Screening.builder()
                .movie(movie)
                .startTime(request.getStartTime())
                .room(request.getRoom())
                .price(request.getPrice() != null ? request.getPrice() : 25.0)
                .build();

        Screening saved = screeningRepository.save(screening);
        return mapToResponse(saved);
    }

    @Transactional
    public ScreeningResponse updateScreening(Long id, ScreeningRequest request) {
        Screening screening = screeningRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found"));

        if (request.getMovieId() != null && !request.getMovieId().equals(screening.getMovie().getId())) {
            Movie movie = movieRepository.findById(request.getMovieId())
                    .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
            screening.setMovie(movie);
        }

        if (request.getStartTime() != null) {
            screening.setStartTime(request.getStartTime());
        }
        if (request.getRoom() != null) {
            screening.setRoom(request.getRoom());
        }
        if (request.getPrice() != null) {
            screening.setPrice(request.getPrice());
        }

        Screening saved = screeningRepository.save(screening);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteScreening(Long id) {
        if (!screeningRepository.existsById(id)) {
            throw new IllegalArgumentException("Screening not found");
        }
        screeningRepository.deleteById(id);
    }

    public List<String> getAllRooms() {
        return screeningRepository.findAllRooms();
    }

    public List<MovieWithScreeningsResponse> getMoviesWithUpcomingScreenings() {
        List<Movie> movies = movieRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        return movies.stream()
                .map(movie -> {
                    List<Screening> upcomingScreenings = screeningRepository
                            .findUpcomingScreeningsByMovieId(movie.getId(), now);
                    
                    return MovieWithScreeningsResponse.builder()
                            .id(movie.getId())
                            .title(movie.getTitle())
                            .description(movie.getDescription())
                            .releaseYear(movie.getReleaseYear())
                            .durationMinutes(movie.getDuration() != null ? (int) movie.getDuration().toMinutes() : null)
                            .director(movie.getDirector())
                            .rating(movie.getRating())
                            .posterUrl(movie.getPosterUrl())
                            .genres(movie.getGenres().stream().map(Genre::getName).collect(Collectors.toList()))
                            .upcomingScreenings(upcomingScreenings.stream()
                                    .map(this::mapToResponse)
                                    .collect(Collectors.toList()))
                            .build();
                })
                .filter(m -> !m.getUpcomingScreenings().isEmpty())
                .collect(Collectors.toList());
    }

    private ScreeningResponse mapToResponse(Screening screening) {
        Movie movie = screening.getMovie();
        LocalDateTime endTime = null;
        
        if (screening.getStartTime() != null && movie.getDuration() != null) {
            endTime = screening.getStartTime().plus(movie.getDuration());
        }

        return ScreeningResponse.builder()
                .id(screening.getId())
                .movieId(movie.getId())
                .movieTitle(movie.getTitle())
                .moviePosterUrl(movie.getPosterUrl())
                .movieDurationMinutes(movie.getDuration() != null ? (int) movie.getDuration().toMinutes() : null)
                .startTime(screening.getStartTime())
                .endTime(endTime)
                .room(screening.getRoom())
                .price(screening.getPrice())
                .build();
    }
}
