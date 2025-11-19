package com.example.movie.controller;


import com.example.movie.dto.response.ApiResponse;
import com.example.movie.dto.screening.PatchScreening;
import com.example.movie.dto.screening.ScreeningRequest;
import com.example.movie.dto.screening.ScreeningResponse;
import com.example.movie.model.Screening;
import com.example.movie.service.ScreeningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/screenings")
public class ScreeningController {
    private final ScreeningService screeningService;

    @PostMapping
    public ResponseEntity<ApiResponse<ScreeningResponse>> createScreening (@Valid @RequestBody ScreeningRequest screeningRequest) {
        ScreeningResponse created = screeningService.createScreening(screeningRequest);
        ApiResponse<ScreeningResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                created,
                "create success",
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ScreeningResponse>> getScreening (@RequestParam long id) {
        ScreeningResponse getScreening = screeningService.getScreening(id);
        ApiResponse<ScreeningResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                getScreening,
                "get screening success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ScreeningResponse>>> getAllScreenings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<ScreeningResponse> screenings = screeningService.getAllScreenings(page, size);
        ApiResponse<List<ScreeningResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                screenings,
                "getAllScreenings success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<ApiResponse<List<ScreeningResponse>>> getScreeningsByMovieId(@PathVariable Long movieId) {
        List<ScreeningResponse> screenings = screeningService.getScreeningsByMovieId(movieId);
        ApiResponse<List<ScreeningResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                screenings,
                "get screenings by movie success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    @PatchMapping
    public ResponseEntity<ApiResponse<ScreeningResponse>>  updateScreening (Long id,@Valid @RequestBody PatchScreening patchScreening) {
        ScreeningResponse updated = screeningService.updateScreening(id, patchScreening);
        ApiResponse<ScreeningResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                updated,
                "update screening success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteScreening (@RequestParam long id) {
        screeningService.deleteScreening(id);
        ApiResponse<Void> result = new ApiResponse<>(
                HttpStatus.OK,
                null,
                "delete screening success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
