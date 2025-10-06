package com.example.movie.controller;

import com.example.movie.dto.auditorium.AuditoriumRequest;
import com.example.movie.dto.auditorium.AuditoriumResponse;
import com.example.movie.dto.auditorium.PatchAuditorium;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.model.Auditorium;
import com.example.movie.service.AuditoriumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auditoriums")
@RestController
public class AuditoriumController {
    private final AuditoriumService auditoriumService;


    @PostMapping
    public ResponseEntity<ApiResponse<AuditoriumResponse>> createAuditorium (@RequestBody AuditoriumRequest auditoriumRequest) {
        AuditoriumResponse created = auditoriumService.createAuditorium(auditoriumRequest);
        ApiResponse<AuditoriumResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                created,
                "create success",
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PatchMapping("{id}")
    public ResponseEntity<ApiResponse<AuditoriumResponse>> updateAuditorium (@PathVariable Long id,@Valid @RequestBody PatchAuditorium patchAuditorium) {
        AuditoriumResponse updated = auditoriumService.updateAuditorium(id,patchAuditorium);
        ApiResponse<AuditoriumResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                updated,
                "update success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }


}
