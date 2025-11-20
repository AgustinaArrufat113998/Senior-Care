package com.ps.careRequest_service.Service.Impl;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.PatientInfoRequestDto;
import com.ps.careRequest_service.Dto.Response.PatientInfoResponseDto;
import com.ps.careRequest_service.Model.Allergy;
import com.ps.careRequest_service.Model.Condition;
import com.ps.careRequest_service.Model.Diseases;
import com.ps.careRequest_service.Model.Medication;
import com.ps.careRequest_service.Model.PatientInfo;
import com.ps.careRequest_service.Repository.AllergyRepository;
import com.ps.careRequest_service.Repository.ConditionRepository;
import com.ps.careRequest_service.Repository.DiseasesRepository;
import com.ps.careRequest_service.Repository.MedicationRepository;
import com.ps.careRequest_service.Repository.PatientInfoRepository;
import com.ps.careRequest_service.Service.Interface.IPatientInfoService;

@Service
public class PatientInfoServiceImpl implements IPatientInfoService {
    private final PatientInfoRepository patientInfoRepository;
    private final DiseasesRepository diseasesRepository;
    private final MedicationRepository medicationRepository;
    private final AllergyRepository allergyRepository;
    private final ConditionRepository conditionRepository;

    public PatientInfoServiceImpl(PatientInfoRepository patientInfoRepository,
            DiseasesRepository diseasesRepository,
            MedicationRepository medicationRepository,
            AllergyRepository allergyRepository,
            ConditionRepository conditionRepository) {
        this.patientInfoRepository = patientInfoRepository;
        this.diseasesRepository = diseasesRepository;
        this.medicationRepository = medicationRepository;
        this.allergyRepository = allergyRepository;
        this.conditionRepository = conditionRepository;
    }

    @Override
    public PatientInfoResponseDto createPatientInfo(PatientInfoRequestDto patientInfoRequestDto) {
        PatientInfo patientInfo = new PatientInfo();
        applyCollections(patientInfo, patientInfoRequestDto);
        PatientInfo savedPatientInfo = patientInfoRepository.save(patientInfo);

        return mapToDto(savedPatientInfo);
    }

    @Override
    public List<PatientInfoResponseDto> getAllPatientInfos() {
        return patientInfoRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
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
        applyCollections(patientInfo, patientInfoRequestDto);
        PatientInfo savedPatientInfo = patientInfoRepository.save(patientInfo);

        return mapToDto(savedPatientInfo);
    }
  
    @Override
    public void deletePatientInfo(Long id) {
        patientInfoRepository.deleteById(id);
    }
    
    public PatientInfoResponseDto mapToDto(PatientInfo patientInfo) {
        PatientInfoResponseDto dto = new PatientInfoResponseDto();
        dto.setId(patientInfo.getId());
        dto.setDiseases(toIdSet(patientInfo.getDiseases(), Diseases::getId));
        dto.setMedications(toIdSet(patientInfo.getMedications(), Medication::getId));
        dto.setAllergies(toIdSet(patientInfo.getAllergies(), Allergy::getId));
        dto.setPatientConditions(toIdSet(patientInfo.getPatientConditions(), Condition::getId));
        dto.setAdditionalInfo(patientInfo.getAdditionalInfo());

        return dto;
    }

    private void applyCollections(PatientInfo patientInfo, PatientInfoRequestDto patientInfoRequestDto) {
        if (patientInfoRequestDto == null) {
            patientInfo.setDiseases(new LinkedHashSet<>());
            patientInfo.setMedications(new LinkedHashSet<>());
            patientInfo.setAllergies(new LinkedHashSet<>());
            patientInfo.setPatientConditions(new LinkedHashSet<>());
            patientInfo.setAdditionalInfo(null);
            return;
        }

        patientInfo.setDiseases(resolveEntities(
                patientInfoRequestDto.getDiseases(),
                diseasesRepository::findById,
                "Disease"));
        patientInfo.setMedications(resolveEntities(
                patientInfoRequestDto.getMedications(),
                medicationRepository::findById,
                "Medication"));
        patientInfo.setAllergies(resolveEntities(
                patientInfoRequestDto.getAllergies(),
                allergyRepository::findById,
                "Allergy"));
        patientInfo.setPatientConditions(resolveEntities(
                patientInfoRequestDto.getPatientConditions(),
                conditionRepository::findById,
                "Condition"));
        patientInfo.setAdditionalInfo(patientInfoRequestDto.getAdditionalInfo());
    }

    private <T> Set<T> resolveEntities(Set<Long> ids,
            Function<Long, Optional<T>> finder,
            String entityLabel) {
        if (ids == null || ids.isEmpty()) {
            return new LinkedHashSet<>();
        }
        return ids.stream()
                .filter(Objects::nonNull)
                .map(id -> finder.apply(id)
                        .orElseThrow(() -> new RuntimeException(entityLabel + " not found with id: " + id)))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private <T> Set<Long> toIdSet(Set<T> entities, Function<T, Long> mapper) {
        if (entities == null || entities.isEmpty()) {
            return Collections.emptySet();
        }
        return entities.stream()
                .map(entity -> entity != null ? mapper.apply(entity) : null)
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
