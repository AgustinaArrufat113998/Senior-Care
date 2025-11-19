package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.MedicationRequestDto;
import com.ps.careRequest_service.Dto.Response.MedicationResponseDto;

public interface IMedicationService {
    MedicationResponseDto createMedication(MedicationRequestDto medicationRequestDto);
    List<MedicationResponseDto> getAllMedications();
    MedicationResponseDto getMedicationById(Long id);
    MedicationResponseDto updateMedication(Long id, MedicationRequestDto medicationRequestDto);
    void deleteMedication(Long id);
}
