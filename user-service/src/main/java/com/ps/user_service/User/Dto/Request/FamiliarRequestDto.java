package com.ps.user_service.User.Dto.Request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FamiliarRequestDto {
    @NotBlank
    private String name;
    @NotBlank
    private String dni;
    @NotNull
    private Long userId;

    private LocalDate birthdate;
    @NotBlank
    private String relationship;
    private String observations;
    @NotBlank
    private String phone;
    private String email;
}
