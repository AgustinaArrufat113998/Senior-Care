package com.ps.careRequest_service.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.AllergyRequestDto;
import com.ps.careRequest_service.Dto.Response.AllergyResponseDto;
import com.ps.careRequest_service.Model.Allergy;
import com.ps.careRequest_service.Repository.AllergyRepository;
import com.ps.careRequest_service.Service.Interface.IAllergyService;

@Service
public class AllergyServiceImpl implements IAllergyService {
    private final AllergyRepository allergyRepository;

    public AllergyServiceImpl(AllergyRepository allergyRepository) {
        this.allergyRepository = allergyRepository;
    }

    @Override
    public AllergyResponseDto createAllergy(AllergyRequestDto allergyRequestDto) {
        Allergy allergy = new Allergy();
        allergy.setAllergy(allergyRequestDto.getAllergy());
        Allergy savedAllergy = allergyRepository.save(allergy);
        return mapToDto(savedAllergy);
    }

    @Override
    public List<AllergyResponseDto> getAllAllergies() {
        return allergyRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AllergyResponseDto getAllergyById(Long id) {
        return allergyRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Allergy not found with id " + id));
    }

    @Override
    public AllergyResponseDto updateAllergy(Long id, AllergyRequestDto allergyRequestDto) {
        Allergy existingAllergy = allergyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Allergy not found with id " + id));

        existingAllergy.setAllergy(allergyRequestDto.getAllergy());
        Allergy updatedAllergy = allergyRepository.save(existingAllergy);
        return mapToDto(updatedAllergy);
    }

    @Override
    public void deleteAllergy(Long id) {
        if (!allergyRepository.existsById(id)) {
            throw new RuntimeException("Allergy not found with id " + id);
        }
        allergyRepository.deleteById(id);
    }

    private AllergyResponseDto mapToDto(Allergy allergy) {
        AllergyResponseDto responseDto = new AllergyResponseDto();
        responseDto.setId(allergy.getId());
        responseDto.setAllergy(allergy.getAllergy());
        return responseDto;
    }
}
