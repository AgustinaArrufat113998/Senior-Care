package com.ps.SeniorCare.User.Service.Implementation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.SeniorCare.User.Dto.UserDto.CaregiverRegisDto;
import com.ps.SeniorCare.User.Dto.UserDto.CaregiverResponseDto;
import com.ps.SeniorCare.User.Dto.UserDto.CaregiverUpdateDto;
import com.ps.SeniorCare.User.Models.Caregiver;
import com.ps.SeniorCare.User.Repository.CaregiverRepository;
import com.ps.SeniorCare.User.Service.Interface.ICaregiverService;

@Service
public class CaregiverServiceImpl implements ICaregiverService {

    private final CaregiverRepository caregiverRepository;

    public CaregiverServiceImpl(CaregiverRepository caregiverRepository) {
        this.caregiverRepository = caregiverRepository;
    }

    @Override
    public CaregiverRegisDto registerCaregiver(CaregiverRegisDto dto) {
        Caregiver caregiver = new Caregiver();
        caregiver.setName(dto.getName());
        caregiver.setSurname(dto.getSurname());
        caregiver.setUsername(dto.getUsername());
        caregiver.setEmail(dto.getEmail());
        caregiver.setDni(dto.getDni());
        caregiver.setAddress(dto.getAddress());
        caregiver.setPhone(dto.getPhone());
        caregiver.setGender(dto.getGender());
        caregiver.setStudies(dto.getStudies());
        caregiver.setExperience(dto.getExperience());
        caregiver.setAvailability(dto.getAvailability());
        caregiver.setRate(dto.getRate());
        caregiver.setSecondaryContact(dto.getSecondaryContact());
        caregiver.setRole("CARETAKER");

        caregiverRepository.save(caregiver);
        return dto;
    }

    @Override
    public Optional<CaregiverResponseDto> findByEmail(String email) {
        return caregiverRepository.findByEmail(email)
                .map(c -> new CaregiverResponseDto(
                        c.getName(),
                        c.getEmail(),
                        c.getStudies(),
                        c.getAvailability(),
                        c.getRate()
                ));
    }

    @Override
    public List<CaregiverResponseDto> findAll() {
        return caregiverRepository.findAll().stream()
                .map(c -> new CaregiverResponseDto(
                        c.getName(),
                        c.getEmail(),
                        c.getStudies(),
                        c.getAvailability(),
                        c.getRate()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public CaregiverResponseDto updateCaregiver(Long id, CaregiverUpdateDto dto) {
        Caregiver caregiver = caregiverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuidador no encontrado"));

        caregiver.setStudies(dto.getStudies());
        caregiver.setExperience(dto.getExperience());
        caregiver.setAvailability(dto.getAvailability());
        caregiver.setRate(dto.getRate());
        caregiver.setSecondaryContact(dto.getSecondaryContact());

        caregiverRepository.save(caregiver);

        return new CaregiverResponseDto(
                caregiver.getName(),
                caregiver.getEmail(),
                caregiver.getStudies(),
                caregiver.getAvailability(),
                caregiver.getRate()
        );
    }

    @Override
public Optional<CaregiverResponseDto> findByDni(String dni) {
    return caregiverRepository.findByDni(dni)
            .map(c -> new CaregiverResponseDto(
                    c.getName(),
                    c.getEmail(),
                    c.getStudies(),
                    c.getAvailability(),
                    c.getRate()
            ));
}

@Override
public Optional<CaregiverResponseDto> findByUsername(String username) {
    return caregiverRepository.findByUsername(username)
            .map(c -> new CaregiverResponseDto(
                    c.getName(),
                    c.getEmail(),
                    c.getStudies(),
                    c.getAvailability(),
                    c.getRate()
            ));
}
}
