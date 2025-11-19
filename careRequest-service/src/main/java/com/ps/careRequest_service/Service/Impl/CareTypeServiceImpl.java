package com.ps.careRequest_service.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.CareTypeRequestDto;
import com.ps.careRequest_service.Dto.Response.CareTypeResponseDto;
import com.ps.careRequest_service.Model.CareType;
import com.ps.careRequest_service.Repository.CareTypeRepository;
import com.ps.careRequest_service.Service.Interface.ICareTypeService;

@Service
public class CareTypeServiceImpl implements ICareTypeService {
    private final CareTypeRepository careTypeRepository;

    public CareTypeServiceImpl(CareTypeRepository careTypeRepository) {
        this.careTypeRepository = careTypeRepository;
    }

    @Override
    public CareTypeResponseDto createCareType(CareTypeRequestDto careTypeRequestDto) {
        CareType careType = new CareType();
        careType.setType(careTypeRequestDto.getType());
        careType.setSpecialties(careTypeRequestDto.getSpecialties());
        CareType savedCareType = careTypeRepository.save(careType);
        return mapToDto(savedCareType);
    }

    @Override
    public List<CareTypeResponseDto> getAllCareTypes() {
        return careTypeRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public CareTypeResponseDto getCareTypeById(Long id) {
        return careTypeRepository.findById(id).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Care Type not found with id " + id));
    }

    @Override
    public CareTypeResponseDto updateCareType(Long id, CareTypeRequestDto careTypeRequestDto) {
        CareType existing = careTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Care Type not found with id " + id));
        existing.setType(careTypeRequestDto.getType());
        existing.setSpecialties(careTypeRequestDto.getSpecialties());
        return mapToDto(careTypeRepository.save(existing));
    }

    @Override
    public void deleteCareType(Long id) {
        if (!careTypeRepository.existsById(id)) {
            throw new RuntimeException("Care Type not found with id " + id);
        }
        careTypeRepository.deleteById(id);
    }

    private CareTypeResponseDto mapToDto(CareType careType) {
        CareTypeResponseDto responseDto = new CareTypeResponseDto();
        responseDto.setId(careType.getId());
        responseDto.setType(careType.getType());
        responseDto.setSpecialties(careType.getSpecialties());
        return responseDto;
    }
}
