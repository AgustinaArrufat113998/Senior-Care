package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.CareRequestDto;
import com.ps.careRequest_service.Dto.Response.CareResponseDto;

public interface ICareRequestService {
    CareResponseDto createCareRequest(CareRequestDto careRequestRequestDto);
    List<CareResponseDto> getAllCareRequests();
    CareResponseDto getCareRequestById(Long id);
    CareResponseDto updateCareRequest(Long id, CareRequestDto careRequestRequestDto);
    void deleteCareRequest(Long id);
}
