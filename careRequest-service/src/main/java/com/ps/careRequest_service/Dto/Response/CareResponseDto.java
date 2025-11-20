package com.ps.careRequest_service.Dto.Response;

import com.ps.careRequest_service.Model.Enum.StatusRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class CareResponseDto {

    private Long id;

    private LocalDate startDate;
    private LocalDate endDate;

    private Time startTime;
    private Time endTime;

    private Set<Long> specialtyIds;
    
    private String genderPreference;
    private String emergencyPhone;

    private StatusRequest status;
    
    private Long requesterId;
    private Long carerId;

    private PatientInfoResponseDto patientInfo;
    private PaymentInfoResponseDto paymentInfo;
}
