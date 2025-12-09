package com.ps.user_service.User.Service.Interface;

import java.util.List;

import com.ps.user_service.User.Dto.Request.FamiliarRequestDto;
import com.ps.user_service.User.Dto.Response.FamiliarResponseDto;

public interface IFamiliarService {
    FamiliarResponseDto addFamiliar(FamiliarRequestDto dto);
    List<FamiliarResponseDto> getFamiliaresByUser(Long userId);
    FamiliarResponseDto updateFamiliar(Long id, FamiliarRequestDto dto);
    void deleteFamiliar(Long id);
    FamiliarResponseDto getFamiliar(Long id);
}
