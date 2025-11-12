package com.ps.SeniorCare.User.Service.Interface;

import java.util.List;
import java.util.Optional;

import com.ps.SeniorCare.User.Dto.UserDto.CaregiverRegisDto;
import com.ps.SeniorCare.User.Dto.UserDto.CaregiverResponseDto;
import com.ps.SeniorCare.User.Dto.UserDto.CaregiverUpdateDto;

public interface ICaregiverService {
    
    CaregiverRegisDto registerCaregiver(CaregiverRegisDto dto);
    Optional<CaregiverResponseDto> findByEmail(String email);
    List<CaregiverResponseDto> findAll();
    CaregiverResponseDto updateCaregiver(Long id, CaregiverUpdateDto dto);
    Optional<CaregiverResponseDto> findByUsername(String username);
    Optional<CaregiverResponseDto> findByDni(String dni);
}
