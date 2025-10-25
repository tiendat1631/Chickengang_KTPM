package com.example.movie.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieSummaryDTO {
    private Long id;
    private String title;
    private String duration;
    private String rated;
    private String genres;
}

