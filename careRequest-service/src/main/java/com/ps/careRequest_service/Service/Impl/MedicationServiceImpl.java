package com.ps.careRequest_service.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.MedicationRequestDto;
import com.ps.careRequest_service.Dto.Response.MedicationResponseDto;
import com.ps.careRequest_service.Model.Medication;
import com.ps.careRequest_service.Repository.MedicationRepository;
import com.ps.careRequest_service.Service.Interface.IMedicationService;

@Service
public class MedicationServiceImpl implements IMedicationService {
    private final MedicationRepository medicationRepository;

    public MedicationServiceImpl(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    @Override
    public MedicationResponseDto createMedication(MedicationRequestDto medicationRequestDto) {
        Medication medication = new Medication();
        medication.setMedication(medicationRequestDto.getMedication());
        Medication savedMedication = medicationRepository.save(medication);
        return mapToDto(savedMedication);
    }

    @Override
    public List<MedicationResponseDto> getAllMedications() {
        return medicationRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public MedicationResponseDto getMedicationById(Long id) {
        return medicationRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Medication not found with id " + id));
    }

    @Override
    public MedicationResponseDto updateMedication(Long id, MedicationRequestDto medicationRequestDto) {
        Medication existingMedication = medicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication not found with id " + id));

        existingMedication.setMedication(medicationRequestDto.getMedication());
        Medication updatedMedication = medicationRepository.save(existingMedication);
        return mapToDto(updatedMedication);
    }

    @Override
    public void deleteMedication(Long id) {
        if (!medicationRepository.existsById(id)) {
            throw new RuntimeException("Medication not found with id " + id);
        }
        medicationRepository.deleteById(id);
    }

    private MedicationResponseDto mapToDto(Medication medication) {
        MedicationResponseDto responseDto = new MedicationResponseDto();
        responseDto.setId(medication.getId());
        responseDto.setMedication(medication.getMedication());
        return responseDto;
    }
}
