package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.PatientInfoRequestDto;
import com.ps.careRequest_service.Dto.Response.PatientInfoResponseDto;

public interface IPatientInfoService {
    PatientInfoResponseDto createPatientInfo(PatientInfoRequestDto patientInfoRequestDto);
    List<PatientInfoResponseDto> getAllPatientInfos();
    PatientInfoResponseDto getPatientInfoById(Long id);
    PatientInfoResponseDto updatePatientInfo(Long id, PatientInfoRequestDto patientInfoRequestDto);
    void deletePatientInfo(Long id);
}
