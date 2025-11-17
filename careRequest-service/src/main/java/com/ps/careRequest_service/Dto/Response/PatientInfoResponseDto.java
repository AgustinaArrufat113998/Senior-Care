package com.ps.careRequest_service.Dto.Response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PatientInfoResponseDto {
    private String name;
    private Integer age;

    private List<DiseasesResponseDto> diseases;
    private List<MedicationResponseDto> medications;
    private List<AllergyResponseDto> allergies;
    private List<ConditionResponseDto> patientConditions;

    private String additionalInfo;
}
