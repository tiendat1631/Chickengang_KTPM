package com.example.movie.service;

import com.example.movie.dto.screening.PatchScreening;
import com.example.movie.dto.screening.ScreeningRequest;
import com.example.movie.dto.screening.ScreeningResponse;

import java.util.List;

public interface ScreeningService {
    ScreeningResponse createScreening(ScreeningRequest screeningRequest);
    ScreeningResponse updateScreening(Long id, PatchScreening patchScreening);
    void  deleteScreening(Long id);
    ScreeningResponse getScreening(Long id);
    List<ScreeningResponse> getScreeningsByMovieId(Long movieId);
    List<ScreeningResponse> getAllScreenings(int page, int size);
}
