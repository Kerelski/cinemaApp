package com.cinema.app.movieservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MovieReviewRequest(
        @NotNull @Min(1) @Max(10) Integer rating,
        @Size(max = 4000) String comment,
        @Email @NotBlank String authorEmail,
        @Size(max = 160) String authorName,
        Boolean approved
) {
}
