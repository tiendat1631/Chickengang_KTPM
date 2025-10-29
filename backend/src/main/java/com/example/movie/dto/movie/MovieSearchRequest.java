package com.example.movie.dto.movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MovieSearchRequest {
    private String searchQuery;
    private String genre;
    private Integer yearFrom;
    private Integer yearTo;
    private String status;
}

