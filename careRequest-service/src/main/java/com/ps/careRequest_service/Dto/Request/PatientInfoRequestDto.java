package com.ps.careRequest_service.Dto.Request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class PatientInfoRequestDto {
    private Set<Long> diseases;
    private Set<Long> medications;
    private Set<Long> allergies;
    private Set<Long> patientConditions;

    private String additionalInfo;
}
