package com.example.movie.dto.auditorium;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class PatchAuditorium {
    private String name;
    
    @Min(value = 1, message = "Số dãy phải lớn hơn 0")
    private Integer rows;
    
    @Min(value = 1, message = "Số ghế mỗi dãy phải lớn hơn 0")
    private Integer columns;
}
