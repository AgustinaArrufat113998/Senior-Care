package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.CareRequestDto;
import com.ps.careRequest_service.Dto.Response.CareRequestResponseDto;

public interface ICareRequestService {
    CareRequestResponseDto createCareRequest(CareRequestDto careRequestRequestDto);
    List<CareRequestResponseDto> getAllCareRequests();
    CareRequestResponseDto getCareRequestById(Long id);
    CareRequestResponseDto updateCareRequest(Long id, CareRequestDto careRequestRequestDto);
    void deleteCareRequest(Long id);
}
