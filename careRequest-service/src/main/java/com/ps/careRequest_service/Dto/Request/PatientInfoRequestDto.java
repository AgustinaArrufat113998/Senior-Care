package com.ps.careRequest_service.Dto.Request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PatientInfoRequestDto {
    private String name;
    private Integer age;

    private List<DiseasesRequestDto> diseases;
    private List<MedicationRequestDto> medications;
    private List<AllergyRequestDto> allergies;
    private List<ConditionRequestDto> patientConditions;

    private String additionalInfo;
}
