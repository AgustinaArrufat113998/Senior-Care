package com.ps.user_service.Carer.Service.Interface;

import java.util.List;

import com.ps.user_service.Carer.Dto.Request.SpecialtyRequestDto;
import com.ps.user_service.Carer.Dto.Response.SpecialtyResponseDto;

public interface ISpecialtyService {
    List<SpecialtyResponseDto> getAllSpicialties();

    SpecialtyResponseDto getSpeciltyById(Long id);

    SpecialtyResponseDto createSpecialty(SpecialtyRequestDto request);

    SpecialtyResponseDto updateSpecialty(Long id, SpecialtyRequestDto request);

    void deleteSpecialty(Long id);
}
