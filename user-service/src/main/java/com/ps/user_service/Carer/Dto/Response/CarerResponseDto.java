package com.ps.user_service.Carer.Dto.Response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class CarerResponseDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String experience;
    private String availability;
    private BigDecimal hourlyRate;

    private SpecialtyResponseDto specialty;
    private Set<SkillResponseDto> skills;
}
