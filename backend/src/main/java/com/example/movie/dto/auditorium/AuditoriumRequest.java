package com.example.movie.dto.auditorium;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuditoriumRequest {

    @NotBlank(message = "Tên phòng chiếu không được để trống")
    private String name;
    
    @NotNull(message = "Số dãy không được để trống")
    @Min(value = 1, message = "Số dãy phải lớn hơn 0")
    private Integer rows;
    
    @NotNull(message = "Số ghế mỗi dãy không được để trống")
    @Min(value = 1, message = "Số ghế mỗi dãy phải lớn hơn 0")
    private Integer columns;
}
