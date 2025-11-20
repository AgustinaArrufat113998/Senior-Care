package com.ps.careRequest_service.Dto.Request;

import com.ps.careRequest_service.Model.Enum.StatusRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class CareRequestDto {

    private LocalDate startDate;
    private LocalDate endDate;

    private LocalTime startTime;
    private LocalTime endTime;

    private Set<Long> specialtyIds;
    
    private String genderPreference;
    private String emergencyPhone;

    private StatusRequest status;

    private Long userId;
    private Long carerId;

    private Long patientInfoId;
    private Long paymentInfoId;
}
