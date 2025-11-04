package com.ps.user_service.Carer.Service.Impl;

import com.ps.user_service.Carer.Dto.Request.CarerRequestDto;
import com.ps.user_service.Carer.Dto.Response.CarerResponseDto;
import com.ps.user_service.Carer.Model.Carer;
import com.ps.user_service.Carer.Repository.CarerRepository;
import com.ps.user_service.Carer.Repository.SkillRepository;
import com.ps.user_service.Carer.Repository.SpecialtyRepository;
import com.ps.user_service.Carer.Service.Interface.ICarerService;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarerServiceImpl implements ICarerService {

    private final CarerRepository carerRepository;
    private final SpecialtyRepository specialtyRepository;
    private final SkillRepository skillRepository;
    private final ModelMapper mapper;

    public CarerServiceImpl(CarerRepository carerRepository,
                            SpecialtyRepository specialtyRepository,
                            SkillRepository skillRepository,
                            ModelMapper mapper) {
        this.carerRepository = carerRepository;
        this.specialtyRepository = specialtyRepository;
        this.skillRepository = skillRepository;
        this.mapper = mapper;
    }

    @Override
    public List<CarerResponseDto> getAllCarers() {
        return carerRepository.findAll().stream()
                .map(carer -> mapper.map(carer, CarerResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public CarerResponseDto getCarerById(Long id) {
        return carerRepository.findById(id)
                .map(carer -> mapper.map(carer, CarerResponseDto.class))
                .orElse(null);
    }

    @Override
    public CarerResponseDto createCarer(CarerRequestDto request) {
        Carer carer = mapper.map(request, Carer.class);
        mapRelations(request, carer);
        return mapper.map(carerRepository.save(carer), CarerResponseDto.class);
    }

    @Override
    public CarerResponseDto updateCarer(Long id, CarerRequestDto request) {
        return carerRepository.findById(id)
                .map(existing -> {
                    mapper.map(request, existing);
                    mapRelations(request, existing);
                    return mapper.map(carerRepository.save(existing), CarerResponseDto.class);
                })
                .orElse(null);
    }

    private void mapRelations(CarerRequestDto dto, Carer carer) {
        if (dto.getSpecialtyId() != null) {
            carer.setSpecialty(specialtyRepository.findById(dto.getSpecialtyId()).orElse(null));
        }
        if (dto.getSkillIds() != null) {
            carer.setSkills(new HashSet<>(skillRepository.findAllById(dto.getSkillIds())));
        }
    }

    @Override
    public void deleteCarer(Long id) {
        carerRepository.deleteById(id);
    }
}
