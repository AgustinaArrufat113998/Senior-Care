package com.ps.careRequest_service.Dto.Response;

import java.util.Set;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatientInfoResponseDto {
    private Long id;

    private Set<Long> diseases;
    private Set<Long> medications;
    private Set<Long> allergies;
    private Set<Long> patientConditions;

    private String additionalInfo;
}
