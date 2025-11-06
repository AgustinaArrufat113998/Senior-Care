package com.ps.user_service.Carer.Service.Interface;

import java.util.List;

import com.ps.user_service.Carer.Dto.Request.CarerRequestDto;
import com.ps.user_service.Carer.Dto.Response.CarerResponseDto;

public interface ICarerService {
    List<CarerResponseDto> getAllCarers();

    CarerResponseDto getCarerById(Long id);

    CarerResponseDto createCarer(CarerRequestDto request);

    CarerResponseDto updateCarer(Long id, CarerRequestDto request);

    void deleteCarer(Long id);
}
