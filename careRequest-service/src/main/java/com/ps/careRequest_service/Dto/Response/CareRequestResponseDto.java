package com.ps.careRequest_service.Dto.Response;

import com.ps.careRequest_service.Dto.CarerSpecialtiesDto;
import com.ps.careRequest_service.Model.Enum.StatusRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class CareRequestResponseDto {

    private Long id;

    private LocalDate startDate;
    private LocalDate endDate;

    private LocalTime startTime;
    private LocalTime endTime;

    private CarerSpecialtiesDto carerSpecialties;
    private String genderPreference;
    private String emergencyPhone;

    private StatusRequest status;
    private Long requesterId;
    private Long carerId;

    private PatientInfoResponseDto patientInfo;
    private PaymentInfoResponseDto paymentInfo;
}
