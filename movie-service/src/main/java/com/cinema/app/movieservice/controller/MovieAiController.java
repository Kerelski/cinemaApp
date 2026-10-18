package com.cinema.app.movieservice.controller;

import com.cinema.app.movieservice.dto.GenerateDescriptionRequest;
import com.cinema.app.movieservice.dto.GenerateDescriptionResponse;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies/ai")
public class MovieAiController {

    private final ChatModel chatModel;

    public MovieAiController(ChatModel chatModel) {
        this.chatModel = chatModel;
    }


    @PostMapping("/generate-description")
    public GenerateDescriptionResponse generateDescription(@RequestBody GenerateDescriptionRequest request) {
        String prompt = String.format("""
        Napisz krótki (maksymalnie 2-3 zdania) opis filmu w języku polskim.
        Tytuł: %s
        Rok: %s
        Reżyser: %s
        Zwróć wyłącznie sam opis.
        """,
                request.title(),
                request.releaseYear() != null ? request.releaseYear() : "brak",
                request.director() != null ? request.director() : "brak"
        );

        String generatedDescription = chatModel.call(prompt);
        return new GenerateDescriptionResponse(generatedDescription.trim());
    }
}