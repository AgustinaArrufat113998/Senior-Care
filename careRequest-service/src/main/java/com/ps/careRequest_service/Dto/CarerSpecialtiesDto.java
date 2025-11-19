package com.ps.careRequest_service.Dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarerSpecialtiesDto {
    private List<Long> specialtyIds;
    private List<SpecialtySummaryDto> specialties;
}
