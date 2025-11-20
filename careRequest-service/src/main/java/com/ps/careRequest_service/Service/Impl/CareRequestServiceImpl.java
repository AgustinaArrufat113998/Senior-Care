package com.ps.careRequest_service.Service.Impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Client.SpecialtyClient;
import com.ps.careRequest_service.Dto.CarerSpecialtiesDto;
import com.ps.careRequest_service.Dto.Request.CareRequestDto;
import com.ps.careRequest_service.Dto.Request.PatientInfoRequestDto;
import com.ps.careRequest_service.Dto.Request.PaymentInfoRequestDto;
import com.ps.careRequest_service.Dto.Response.CareRequestResponseDto;
import com.ps.careRequest_service.Dto.Response.PatientInfoResponseDto;
import com.ps.careRequest_service.Dto.Response.PaymentInfoResponseDto;
import com.ps.careRequest_service.Dto.SpecialtySummaryDto;
import com.ps.careRequest_service.Model.CareRequest;
import com.ps.careRequest_service.Model.PatientInfo;
import com.ps.careRequest_service.Model.PaymentInfo;
import com.ps.careRequest_service.Repository.CareRequestRepository;
import com.ps.careRequest_service.Service.Interface.ICareRequestService;

@Service
public class CareRequestServiceImpl implements ICareRequestService {

    private final CareRequestRepository careRequestRepository;
    private final SpecialtyClient specialtyClient;

    public CareRequestServiceImpl(CareRequestRepository careRequestRepository,
            SpecialtyClient specialtyClient) {
        this.careRequestRepository = careRequestRepository;
        this.specialtyClient = specialtyClient;
    }

    @Override
    public CareRequestResponseDto createCareRequest(CareRequestDto dto) {
        CareRequest entity = new CareRequest();
        applyDtoToEntity(dto, entity);
        return mapToDto(careRequestRepository.save(entity));
    }

    @Override
    public List<CareRequestResponseDto> getAllCareRequests() {
        return careRequestRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CareRequestResponseDto getCareRequestById(Long id) {
        return careRequestRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Care request not found with id " + id));
    }

    @Override
    public CareRequestResponseDto updateCareRequest(Long id, CareRequestDto dto) {
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
        entity.setRequesterId(dto.getRequesterId());
        entity.setCarerId(dto.getCarerId());
        if (dto.getCarerSpecialties() != null) {
            entity.setSpecialtyIds(resolveSpecialtyIds(dto.getCarerSpecialties()));
        }

        entity.setPatientInfo(mergePatientInfo(dto.getPatientInfo(), entity.getPatientInfo()));
        entity.setPaymentInfo(mergePaymentInfo(dto.getPaymentInfo(), entity.getPaymentInfo()));
    }

    private PatientInfo mergePatientInfo(PatientInfoRequestDto dto, PatientInfo current) {
        if (dto == null) {
            return current;
        }

        PatientInfo info = current != null ? current : new PatientInfo();
        info.setName(dto.getName());
        info.setAge(dto.getAge());
        info.setDiseases(dto.getDiseases());
        info.setMedications(dto.getMedications());
        info.setAllergies(dto.getAllergies());
        info.setPatientConditions(dto.getPatientConditions());
        info.setAdditionalInfo(dto.getAdditionalInfo());
        return info;
    }

    private PaymentInfo mergePaymentInfo(PaymentInfoRequestDto dto, PaymentInfo current) {
        if (dto == null) {
            return current;
        }

        PaymentInfo payment = current != null ? current : new PaymentInfo();
        payment.setAmount(dto.getAmount());
        payment.setCurrency(dto.getCurrency());
        payment.setMethod(dto.getMethod());
        payment.setStatus(dto.getStatus());
        payment.setPaidAt(dto.getPaidAt());
        payment.setReference(dto.getReference());
        return payment;
    }

    private CareRequestResponseDto mapToDto(CareRequest entity) {
        CareRequestResponseDto dto = new CareRequestResponseDto();
        dto.setId(entity.getId());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setGenderPreference(entity.getGenderPreference());
        dto.setEmergencyPhone(entity.getEmergencyPhone());
        dto.setStatus(entity.getStatus());
        dto.setRequesterId(entity.getRequesterId());
        dto.setCarerId(entity.getCarerId());
        dto.setCarerSpecialties(mapSpec(entity.getSpecialtyIds()));
        dto.setPatientInfo(mapPatientInfoDto(entity.getPatientInfo()));
        dto.setPaymentInfo(mapPaymentInfoDto(entity.getPaymentInfo()));
        return dto;
    }

    private PatientInfoResponseDto mapPatientInfoDto(PatientInfo entity) {
        if (entity == null) {
            return null;
        }
        PatientInfoResponseDto dto = new PatientInfoResponseDto();
        dto.setName(entity.getName());
        dto.setAge(entity.getAge());
        dto.setDiseases(entity.getDiseases());
        dto.setMedications(entity.getMedications());
        dto.setAllergies(entity.getAllergies());
        dto.setPatientConditions(entity.getPatientConditions());
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

    private List<Long> resolveSpecialtyIds(CarerSpecialtiesDto carerSpecialtiesDto) {
        List<Long> ids = carerSpecialtiesDto.getSpecialtyIds();
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }

        Map<Long, SpecialtySummaryDto> available = fetchSpecialtyCatalog();
        List<Long> filteredIds = ids.stream()
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        List<Long> missing = filteredIds.stream()
                .filter(id -> !available.containsKey(id))
                .collect(Collectors.toList());
        if (!missing.isEmpty()) {
            throw new IllegalArgumentException("Specialties not found in user-service: " + missing);
        }

        return new ArrayList<>(filteredIds);
    }

    private CarerSpecialtiesDto mapSpec(List<Long> specialtyIds) {
        if (specialtyIds == null || specialtyIds.isEmpty()) {
            return null;
        }
        CarerSpecialtiesDto dto = new CarerSpecialtiesDto();
        dto.setSpecialtyIds(new ArrayList<>(specialtyIds));
        return dto;
    }

    private List<SpecialtySummaryDto> buildSpecialtySummaries(List<Long> specialtyIds) {
        Map<Long, SpecialtySummaryDto> catalog = fetchSpecialtyCatalog();
        return specialtyIds.stream()
                .map(catalog::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private Map<Long, SpecialtySummaryDto> fetchSpecialtyCatalog() {
        try {
            List<SpecialtySummaryDto> specialties = specialtyClient.getAllSpecialties();
            if (specialties == null || specialties.isEmpty()) {
                return Collections.emptyMap();
            }
            return specialties.stream()
                    .filter(spec -> spec.getId() != null)
                    .collect(Collectors.toMap(SpecialtySummaryDto::getId, spec -> spec, (left, right) -> left));
        } catch (Exception ex) {
            throw new RuntimeException("Unable to retrieve specialties from user-service", ex);
        }
    }
}
