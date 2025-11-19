package com.ps.careRequest_service.Dto.Request;

import com.ps.careRequest_service.Model.Enum.StatusRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class CareRequestRequestDto {

    private LocalDate startDate;
    private LocalDate endDate;

    private LocalTime startTime;
    private LocalTime endTime;

    private CareTypeRequestDto careType;
    private String genderPreference;
    private String emergencyPhone;

    private StatusRequest status;
    private Long requesterId;
    private Long carerId;

    private PatientInfoRequestDto patientInfo;
    private PaymentInfoRequestDto paymentInfo;
}
