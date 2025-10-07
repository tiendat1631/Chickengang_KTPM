package com.example.movie.service;

import com.example.movie.dto.auditorium.AuditoriumRequest;
import com.example.movie.dto.auditorium.AuditoriumResponse;
import com.example.movie.dto.auditorium.PatchAuditorium;

public interface AuditoriumService {
    AuditoriumResponse createAuditorium(AuditoriumRequest auditoriumRequest);
    AuditoriumResponse updateAuditorium(Long id, PatchAuditorium patchAuditorium);
    void  deleteAuditorium(Long id);
    AuditoriumResponse getAuditorium(Long id);
}
