package com.ps.careRequest_service.Service.Impl;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.CareRequestDto;
import com.ps.careRequest_service.Dto.Response.CareResponseDto;
import com.ps.careRequest_service.Dto.Response.PatientInfoResponseDto;
import com.ps.careRequest_service.Dto.Response.PaymentInfoResponseDto;
import com.ps.careRequest_service.Model.Allergy;
import com.ps.careRequest_service.Model.CareRequest;
import com.ps.careRequest_service.Model.Condition;
import com.ps.careRequest_service.Model.Diseases;
import com.ps.careRequest_service.Model.Medication;
import com.ps.careRequest_service.Model.PatientInfo;
import com.ps.careRequest_service.Model.PaymentInfo;
import com.ps.careRequest_service.Repository.CareRequestRepository;
import com.ps.careRequest_service.Repository.PatientInfoRepository;
import com.ps.careRequest_service.Repository.PaymentInfoRepository;
import com.ps.careRequest_service.Service.Interface.ICareRequestService;

@Service
public class CareRequestServiceImpl implements ICareRequestService {

    private final CareRequestRepository careRequestRepository;
    private final PatientInfoRepository patientInfoRepository;
    private final PaymentInfoRepository paymentInfoRepository;
    public CareRequestServiceImpl(CareRequestRepository careRequestRepository,
            PatientInfoRepository patientInfoRepository,
            PaymentInfoRepository paymentInfoRepository) {
        this.careRequestRepository = careRequestRepository;
        this.patientInfoRepository = patientInfoRepository;
        this.paymentInfoRepository = paymentInfoRepository;
    }

    @Override
    public CareResponseDto createCareRequest(CareRequestDto dto) {
        CareRequest entity = new CareRequest();
        applyDtoToEntity(dto, entity);
        return mapToDto(careRequestRepository.save(entity));
    }

    @Override
    public List<CareResponseDto> getAllCareRequests() {
        return careRequestRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CareResponseDto getCareRequestById(Long id) {
        return careRequestRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Care request not found with id " + id));
    }

    @Override
    public CareResponseDto updateCareRequest(Long id, CareRequestDto dto) {
        CareRequest existing = careRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Care request not found with id " + id));
        applyDtoToEntity(dto, existing);
        return mapToDto(careRequestRepository.save(existing));
    }

    @Override
    public void deleteCareRequest(Long id) {
        if (!careRequestRepository.existsById(id)) {
            throw new RuntimeException("Care request not found with id " + id);
        }
        careRequestRepository.deleteById(id);
    }

    private void applyDtoToEntity(CareRequestDto dto, CareRequest entity) {
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setGenderPreference(dto.getGenderPreference());
        entity.setEmergencyPhone(dto.getEmergencyPhone());
        entity.setStatus(dto.getStatus());
        entity.setUserId(dto.getUserId());
        entity.setCarerId(dto.getCarerId());

        entity.setSpecialtyIds(dto.getSpecialtyIds() == null
                ? new LinkedHashSet<>()
                : new LinkedHashSet<>(dto.getSpecialtyIds()));

        PatientInfo patientInfo = null;
        if (dto.getPatientInfoId() != null) {
            patientInfo = patientInfoRepository.findById(dto.getPatientInfoId())
                    .orElseThrow(() -> new RuntimeException(
                            "Patient info not found with id " + dto.getPatientInfoId()));
        }
        entity.setPatientInfo(patientInfo);

        entity.setPaymentInfo(resolvePaymentInfo(dto.getPaymentInfoId(), entity.getPaymentInfo()));
    }

    private <T> Set<Long> extractIds(Collection<T> source, Function<T, Long> mapper) {
        if (source == null || source.isEmpty()) {
            return Collections.emptySet();
        }
        return source.stream()
                .map(item -> item != null ? mapper.apply(item) : null)
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private PaymentInfo resolvePaymentInfo(Long paymentInfoId, PaymentInfo current) {
        if (paymentInfoId == null) {
            return current;
        }
        if (current != null && Objects.equals(current.getId(), paymentInfoId)) {
            return current;
        }
        return paymentInfoRepository.findById(paymentInfoId)
                .orElseThrow(() -> new RuntimeException("Payment info not found with id " + paymentInfoId));
    }

    private CareResponseDto mapToDto(CareRequest entity) {
        CareResponseDto dto = new CareResponseDto();
        dto.setId(entity.getId());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setGenderPreference(entity.getGenderPreference());
        dto.setEmergencyPhone(entity.getEmergencyPhone());
        dto.setStatus(entity.getStatus());
        dto.setRequesterId(entity.getUserId());
        dto.setCarerId(entity.getCarerId());
        dto.setSpecialtyIds(entity.getSpecialtyIds());
        dto.setPatientInfo(mapPatientInfoDto(entity.getPatientInfo()));
        dto.setPaymentInfo(mapPaymentInfoDto(entity.getPaymentInfo()));
        return dto;
    }

    private PatientInfoResponseDto mapPatientInfoDto(PatientInfo entity) {
        if (entity == null) {
            return null;
        }
        PatientInfoResponseDto dto = new PatientInfoResponseDto();
        dto.setId(entity.getId());
        dto.setDiseases(extractIds(entity.getDiseases(), Diseases::getId));
        dto.setMedications(extractIds(entity.getMedications(), Medication::getId));
        dto.setAllergies(extractIds(entity.getAllergies(), Allergy::getId));
        dto.setPatientConditions(extractIds(entity.getPatientConditions(), Condition::getId));
        dto.setAdditionalInfo(entity.getAdditionalInfo());
        return dto;
    }

    private PaymentInfoResponseDto mapPaymentInfoDto(PaymentInfo entity) {
        if (entity == null) {
            return null;
        }
        PaymentInfoResponseDto dto = new PaymentInfoResponseDto();
        dto.setAmount(entity.getAmount());
        dto.setCurrency(entity.getCurrency());
        dto.setMethod(entity.getMethod());
        dto.setStatus(entity.getStatus());
        dto.setPaidAt(entity.getPaidAt());
        dto.setReference(entity.getReference());
        return dto;
    }
}
