package com.cinema.app.movieservice.dto;

public record GenerateDescriptionRequest(
        String title,
        Integer releaseYear,
        String director
)
{

}
