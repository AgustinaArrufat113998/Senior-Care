package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.AllergyRequestDto;
import com.ps.careRequest_service.Dto.Response.AllergyResponseDto;

public interface IAllergyService {
    AllergyResponseDto createAllergy(AllergyRequestDto allergyRequestDto);
    List<AllergyResponseDto> getAllAllergies();
    AllergyResponseDto getAllergyById(Long id);
    AllergyResponseDto updateAllergy(Long id, AllergyRequestDto allergyRequestDto);
    void deleteAllergy(Long id);
}