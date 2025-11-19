package com.ps.careRequest_service.Service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.PatientInfoRequestDto;
import com.ps.careRequest_service.Dto.Response.PatientInfoResponseDto;
import com.ps.careRequest_service.Model.PatientInfo;
import com.ps.careRequest_service.Repository.PatientInfoRepository;
import com.ps.careRequest_service.Service.Interface.IPatientInfoService;

@Service
public class PatientInfoServiceImpl implements IPatientInfoService {
    private final PatientInfoRepository patientInfoRepository;

    public PatientInfoServiceImpl(PatientInfoRepository patientInfoRepository) {
        this.patientInfoRepository = patientInfoRepository;
    }

    @Override
    public PatientInfoResponseDto createPatientInfo(PatientInfoRequestDto patientInfoRequestDto) {
        PatientInfo patientInfo = new PatientInfo();
        patientInfo.setName(patientInfoRequestDto.getName());
        patientInfo.setAge(patientInfoRequestDto.getAge());
        patientInfo.setDiseases(patientInfoRequestDto.getDiseases());
        patientInfo.setMedications(patientInfoRequestDto.getMedications());
        patientInfo.setAllergies(patientInfoRequestDto.getAllergies());
        patientInfo.setPatientConditions(patientInfoRequestDto.getPatientConditions());
        patientInfo.setAdditionalInfo(patientInfoRequestDto.getAdditionalInfo());
        PatientInfo savedPatientInfo = patientInfoRepository.save(patientInfo);
        return mapToDto(savedPatientInfo);
    }

    @Override
    public List<PatientInfoResponseDto> getAllPatientInfos() {
        return patientInfoRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public PatientInfoResponseDto getPatientInfoById(Long id) {
        return patientInfoRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("PatientInfo not found with id: " + id));
    }

    @Override
    public PatientInfoResponseDto updatePatientInfo(Long id, PatientInfoRequestDto patientInfoRequestDto) {
        PatientInfo patientInfo = patientInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PatientInfo not found with id: " + id));
        patientInfo.setName(patientInfoRequestDto.getName());
        patientInfo.setAge(patientInfoRequestDto.getAge());
        patientInfo.setDiseases(patientInfoRequestDto.getDiseases());
        patientInfo.setMedications(patientInfoRequestDto.getMedications());
        patientInfo.setAllergies(patientInfoRequestDto.getAllergies());
        patientInfo.setPatientConditions(patientInfoRequestDto.getPatientConditions());
        patientInfo.setAdditionalInfo(patientInfoRequestDto.getAdditionalInfo());
        PatientInfo savedPatientInfo = patientInfoRepository.save(patientInfo);

        return mapToDto(savedPatientInfo);
    }

    @Override
    public void deletePatientInfo(Long id) {
        patientInfoRepository.deleteById(id);
    }
    
    public PatientInfoResponseDto mapToDto(PatientInfo patientInfo) {
        PatientInfoResponseDto dto = new PatientInfoResponseDto();
        dto.setName(patientInfo.getName());
        dto.setAge(patientInfo.getAge());
        dto.setDiseases(patientInfo.getDiseases());
        dto.setMedications(patientInfo.getMedications());
        dto.setAllergies(patientInfo.getAllergies());
        dto.setPatientConditions(patientInfo.getPatientConditions());
        dto.setAdditionalInfo(patientInfo.getAdditionalInfo());

        return dto;
    }
}
