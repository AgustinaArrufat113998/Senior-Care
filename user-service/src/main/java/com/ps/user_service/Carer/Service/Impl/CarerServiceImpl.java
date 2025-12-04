package com.ps.user_service.Carer.Service.Impl;

import com.ps.user_service.Carer.Dto.Request.CarerRequestDto;
import com.ps.user_service.Carer.Dto.Response.CarerResponseDto;
import com.ps.user_service.Carer.Model.Carer;
import com.ps.user_service.Carer.Model.Skill;
import com.ps.user_service.Carer.Model.Specialty;
import com.ps.user_service.Carer.Repository.CarerRepository;
import com.ps.user_service.Carer.Repository.SkillRepository;
import com.ps.user_service.Carer.Repository.SpecialtyRepository;
import com.ps.user_service.Carer.Service.Interface.ICarerService;
import com.ps.user_service.User.Models.User;
import com.ps.user_service.User.Models.Enum.Role;
import com.ps.user_service.User.Repository.UserRepository;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CarerServiceImpl implements ICarerService {

    private final CarerRepository carerRepository;
    private final SpecialtyRepository specialtyRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    public CarerServiceImpl(CarerRepository carerRepository,
                            SpecialtyRepository specialtyRepository,
                            SkillRepository skillRepository,
                            UserRepository userRepository,
                            ModelMapper mapper) {
        this.carerRepository = carerRepository;
        this.specialtyRepository = specialtyRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    public List<CarerResponseDto> getAllCarers() {
        return carerRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CarerResponseDto getCarerById(Long id) {
        return carerRepository.findById(id)
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Override
    public CarerResponseDto createCarer(CarerRequestDto request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        if (carerRepository.existsByUser(user)) {
            throw new RuntimeException("This user is already registered as a carer");
        }

        // Cambiar el rol
        user.setRole(Role.CARETAKER);
        userRepository.save(user);

        // Crear el nuevo Carer vinculado al usuario
        Carer carer = new Carer();
        carer.setUser(user);
        carer.setExperience(request.getExperience());
        carer.setAvailability(request.getAvailability());
        carer.setHourlyRate(request.getHourlyRate());
        carer.setNewSkills(request.getNewSkills());

        if (request.getSpecialtyId() != null) {
            Specialty specialty = specialtyRepository.findById(request.getSpecialtyId())
                    .orElse(null);
            carer.setSpecialty(specialty);
        }

        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            Set<Skill> skills = new HashSet<>(skillRepository.findAllById(request.getSkillIds()));
            carer.setSkills(skills);
        }

        Carer saved = carerRepository.save(carer);
        return mapToResponse(saved);
    }

    @Override
    public CarerResponseDto updateCarer(Long id, CarerRequestDto request) {
        return carerRepository.findById(id)
                .map(existing -> {
                    mapper.map(request, existing);
                    mapRelations(request, existing);
                    return mapToResponse(carerRepository.save(existing));
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

    private CarerResponseDto mapToResponse(Carer carer) {
        CarerResponseDto dto = mapper.map(carer, CarerResponseDto.class);
        if (carer.getUser() != null) {
            dto.setUserId(carer.getUser().getId());
            dto.setFirstName(carer.getUser().getName());
            dto.setLastName(carer.getUser().getSurname());
            dto.setEmail(carer.getUser().getEmail());
            dto.setPhone(carer.getUser().getPhone());
        }
        return dto;
    }
}
