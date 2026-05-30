package com.cinema.app.movieservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieWithScreeningsResponse {

    private Long id;
    private String title;
    private String description;
    private Integer releaseYear;
    private Integer durationMinutes;
    private String director;
    private Double rating;
    private String posterUrl;
    private List<String> genres;
    private List<ScreeningResponse> upcomingScreenings;
}
