package com.ps.careRequest_service.Model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientInfo {
    private String name;
    private Integer age;
    private String diseases;
    private String medications;
    private String allergies;
    private String patientConditions;
}

