package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.AssaignRequestDto;
import com.ps.careRequest_service.Dto.Request.CareRequestDto;
import com.ps.careRequest_service.Dto.Request.StatusRequestDto;
import com.ps.careRequest_service.Dto.Response.CareResponseDto;

public interface ICareRequestService {
    CareResponseDto createCareRequest(CareRequestDto careRequestRequestDto);
    List<CareResponseDto> getAllCareRequests();
    CareResponseDto getCareRequestById(Long id);
    CareResponseDto updateCareRequest(Long id, CareRequestDto careRequestRequestDto);
    void deleteCareRequest(Long id);
    StatusRequestDto updateCareRequestStatus(Long id, StatusRequestDto statusRequestDto);
    StatusRequestDto getCareRequestStatus(Long id);
    AssaignRequestDto assignCarerToRequest(Long requestId, AssaignRequestDto assaignRequestDto);
}
