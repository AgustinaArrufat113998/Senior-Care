package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.DiseasesRequestDto;
import com.ps.careRequest_service.Dto.Response.DiseasesResponseDto;

public interface IDiseaseService {
    DiseasesResponseDto createDisease(DiseasesRequestDto diseasesRequestDto);
    List<DiseasesResponseDto> getAllDiseases();
    DiseasesResponseDto getDiseaseById(Long id);
    DiseasesResponseDto updateDisease(Long id, DiseasesRequestDto diseasesRequestDto);
    void deleteDisease(Long id);
}
