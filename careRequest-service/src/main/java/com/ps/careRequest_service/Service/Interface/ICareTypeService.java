package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.CareTypeRequestDto;
import com.ps.careRequest_service.Dto.Response.CareTypeResponseDto;

public interface ICareTypeService {
    CareTypeResponseDto createCareType(CareTypeRequestDto careTypeRequestDto);
    List<CareTypeResponseDto> getAllCareTypes();
    CareTypeResponseDto getCareTypeById(Long id);
    CareTypeResponseDto updateCareType(Long id, CareTypeRequestDto careTypeRequestDto);
    void deleteCareType(Long id);
}
