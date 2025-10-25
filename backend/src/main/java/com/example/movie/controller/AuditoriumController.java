package com.example.movie.controller;

import com.example.movie.dto.auditorium.AuditoriumRequest;
import com.example.movie.dto.auditorium.AuditoriumResponse;
import com.example.movie.dto.auditorium.PatchAuditorium;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.service.AuditoriumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auditoriums")
@RestController
public class AuditoriumController {
    private final AuditoriumService auditoriumService;


    @PreAuthorize("hasRole('ADMIN')")
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

    @PreAuthorize("hasRole('ADMIN')")
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditoriumResponse>>> getAllAuditoriums(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<AuditoriumResponse> auditoriums = auditoriumService.getAllAuditoriums(page, size);
        ApiResponse<List<AuditoriumResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                auditoriums,
                "getAllAuditoriums success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuditoriumResponse>> getAuditoriumById(@PathVariable Long id) {
        AuditoriumResponse getAuditorium = auditoriumService.getAuditorium(id);
        ApiResponse<AuditoriumResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                getAuditorium,
                "getAuditorium success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAuditoriumById(@PathVariable Long id) {
        auditoriumService.deleteAuditorium(id);
        ApiResponse<Void> result = new ApiResponse<>(
                HttpStatus.OK,
                null,
                "delete success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
