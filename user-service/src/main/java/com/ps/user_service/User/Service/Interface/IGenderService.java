package com.ps.user_service.User.Service.Interface;

import com.ps.user_service.User.Dto.GenderDto;

import java.util.List;

public interface IGenderService {
    List<GenderDto> findAll();
    GenderDto save(GenderDto genderDto);
    GenderDto update(Long id, GenderDto gender);
    void delete(Long id);
}
