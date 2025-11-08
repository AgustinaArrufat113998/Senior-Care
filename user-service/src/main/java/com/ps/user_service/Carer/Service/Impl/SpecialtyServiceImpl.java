package com.ps.user_service.Carer.Service.Impl;

import com.ps.user_service.Carer.Dto.Request.SpecialtyRequestDto;
import com.ps.user_service.Carer.Dto.Response.SpecialtyResponseDto;
import com.ps.user_service.Carer.Model.Specialty;
import com.ps.user_service.Carer.Repository.SpecialtyRepository;
import com.ps.user_service.Carer.Service.Interface.ISpecialtyService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecialtyServiceImpl implements ISpecialtyService {

    private final SpecialtyRepository specialtyRepository;
    private final ModelMapper mapper;

    public SpecialtyServiceImpl(SpecialtyRepository specialtyRepository, ModelMapper mapper) {
        this.specialtyRepository = specialtyRepository;
        this.mapper = mapper;
    }

    @Override
    public List<SpecialtyResponseDto> getAllSpicialties() {
        return specialtyRepository.findAll()
                .stream()
                .map(specialty -> mapper.map(specialty, SpecialtyResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public SpecialtyResponseDto getSpeciltyById(Long id) {
        return specialtyRepository.findById(id)
                .map(specialty -> mapper.map(specialty, SpecialtyResponseDto.class))
                .orElse(null);
    }

    @Override
    public SpecialtyResponseDto createSpecialty(SpecialtyRequestDto request) {
        Specialty specialty = mapper.map(request, Specialty.class);
        Specialty saved = specialtyRepository.save(specialty);
        return mapper.map(saved, SpecialtyResponseDto.class);
    }

    @Override
    public SpecialtyResponseDto updateSpecialty(Long id, SpecialtyRequestDto request) {
        return specialtyRepository.findById(id)
                .map(existing -> {
                    mapper.map(request, existing);
                    Specialty updated = specialtyRepository.save(existing);
                    return mapper.map(updated, SpecialtyResponseDto.class);
                })
                .orElse(null);
    }

    @Override
    public void deleteSpecialty(Long id) {
        specialtyRepository.deleteById(id);
    }
}
