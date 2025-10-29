package com.example.movie.specification;

import com.example.movie.model.Movie;
import com.example.movie.model.MovieStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class MovieSpecification {

    /**
     * Search by keyword in title, description, genres, and actors
     */
    public static Specification<Movie> searchByKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            
            String likePattern = "%" + keyword.toLowerCase() + "%";
            
            return criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likePattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("genres")), likePattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("actors")), likePattern)
            );
        };
    }

    /**
     * Filter by genre (substring match)
     */
    public static Specification<Movie> filterByGenre(String genre) {
        return (root, query, criteriaBuilder) -> {
            if (genre == null || genre.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            
            String likePattern = "%" + genre.toLowerCase() + "%";
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("genres")), likePattern);
        };
    }

    /**
     * Filter by year range
     */
    public static Specification<Movie> filterByYearRange(Integer yearFrom, Integer yearTo) {
        return (root, query, criteriaBuilder) -> {
            if (yearFrom == null && yearTo == null) {
                return criteriaBuilder.conjunction();
            }
            
            if (yearFrom != null && yearTo != null) {
                LocalDate dateFrom = LocalDate.of(yearFrom, 1, 1);
                LocalDate dateTo = LocalDate.of(yearTo, 12, 31);
                return criteriaBuilder.between(root.get("releaseDate"), dateFrom, dateTo);
            } else if (yearFrom != null) {
                LocalDate dateFrom = LocalDate.of(yearFrom, 1, 1);
                return criteriaBuilder.greaterThanOrEqualTo(root.get("releaseDate"), dateFrom);
            } else {
                LocalDate dateTo = LocalDate.of(yearTo, 12, 31);
                return criteriaBuilder.lessThanOrEqualTo(root.get("releaseDate"), dateTo);
            }
        };
    }

    /**
     * Filter by status
     */
    public static Specification<Movie> filterByStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || status.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            
            try {
                MovieStatus movieStatus = MovieStatus.valueOf(status.toUpperCase());
                return criteriaBuilder.equal(root.get("status"), movieStatus);
            } catch (IllegalArgumentException e) {
                return criteriaBuilder.conjunction();
            }
        };
    }
}

