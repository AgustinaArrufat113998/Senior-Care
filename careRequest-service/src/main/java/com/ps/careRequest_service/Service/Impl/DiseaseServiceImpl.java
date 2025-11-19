package com.ps.careRequest_service.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.DiseasesRequestDto;
import com.ps.careRequest_service.Dto.Response.DiseasesResponseDto;
import com.ps.careRequest_service.Model.Diseases;
import com.ps.careRequest_service.Repository.DiseasesRepository;
import com.ps.careRequest_service.Service.Interface.IDiseaseService;

@Service
public class DiseaseServiceImpl implements IDiseaseService {
    private final DiseasesRepository diseaseRepository;

    public DiseaseServiceImpl(DiseasesRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    @Override
    public DiseasesResponseDto createDisease(DiseasesRequestDto diseasesRequestDto) {
        Diseases disease = new Diseases();
        disease.setDisease(diseasesRequestDto.getDisease());
        Diseases savedDisease = diseaseRepository.save(disease);
        return mapToDto(savedDisease);
    }

    @Override
    public List<DiseasesResponseDto> getAllDiseases() {
        return diseaseRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DiseasesResponseDto getDiseaseById(Long id) {
        return diseaseRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Disease not found with id " + id));
    }

    @Override
    public DiseasesResponseDto updateDisease(Long id, DiseasesRequestDto diseasesRequestDto) {
        Diseases existingDisease = diseaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disease not found with id " + id));

        existingDisease.setDisease(diseasesRequestDto.getDisease());
        Diseases updatedDisease = diseaseRepository.save(existingDisease);
        return mapToDto(updatedDisease);
    }

    @Override
    public void deleteDisease(Long id) {
        if (!diseaseRepository.existsById(id)) {
            throw new RuntimeException("Disease not found with id " + id);
        }
        diseaseRepository.deleteById(id);
    }

    private DiseasesResponseDto mapToDto(Diseases disease) {
        DiseasesResponseDto responseDto = new DiseasesResponseDto();
        responseDto.setId(disease.getId());
        responseDto.setDisease(disease.getDisease());
        return responseDto;
    }
}
