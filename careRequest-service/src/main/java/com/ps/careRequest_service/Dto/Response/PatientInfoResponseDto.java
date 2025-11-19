package com.ps.careRequest_service.Dto.Response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.ps.careRequest_service.Model.Allergy;
import com.ps.careRequest_service.Model.Condition;
import com.ps.careRequest_service.Model.Diseases;
import com.ps.careRequest_service.Model.Medication;

@Getter
@Setter
@NoArgsConstructor
public class PatientInfoResponseDto {
    private String name;
    private Integer age;

    private List<Diseases> diseases;
    private List<Medication> medications;
    private List<Allergy> allergies;
    private List<Condition> patientConditions;

    private String additionalInfo;
}
