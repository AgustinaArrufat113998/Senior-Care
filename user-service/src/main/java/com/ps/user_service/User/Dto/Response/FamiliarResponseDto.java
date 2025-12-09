package com.ps.user_service.User.Dto.Response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamiliarResponseDto {
    private Long id;
    private String name;
    private String dni;
    private LocalDate birthdate;
    private String relationship;
    private String observations;
    private String phone;
    private String email;
    private Long userId;
}
