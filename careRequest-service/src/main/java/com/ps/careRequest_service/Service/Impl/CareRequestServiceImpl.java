package com.ps.careRequest_service.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.CareRequestRequestDto;
import com.ps.careRequest_service.Dto.Request.CareTypeRequestDto;
import com.ps.careRequest_service.Dto.Request.PatientInfoRequestDto;
import com.ps.careRequest_service.Dto.Request.PaymentInfoRequestDto;
import com.ps.careRequest_service.Dto.Response.CareRequestResponseDto;
import com.ps.careRequest_service.Dto.Response.CareTypeResponseDto;
import com.ps.careRequest_service.Dto.Response.PatientInfoResponseDto;
import com.ps.careRequest_service.Dto.Response.PaymentInfoResponseDto;
import com.ps.careRequest_service.Model.CareRequest;
import com.ps.careRequest_service.Model.CareType;
import com.ps.careRequest_service.Model.PatientInfo;
import com.ps.careRequest_service.Model.PaymentInfo;
import com.ps.careRequest_service.Repository.CareRequestRepository;
import com.ps.careRequest_service.Repository.CareTypeRepository;
import com.ps.careRequest_service.Service.Interface.ICareRequestService;

@Service
public class CareRequestServiceImpl implements ICareRequestService {

    private final CareRequestRepository careRequestRepository;
    private final CareTypeRepository careTypeRepository;

    public CareRequestServiceImpl(CareRequestRepository careRequestRepository, CareTypeRepository careTypeRepository) {
        this.careRequestRepository = careRequestRepository;
        this.careTypeRepository = careTypeRepository;
    }

    @Override
    public CareRequestResponseDto createCareRequest(CareRequestRequestDto dto) {
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
    public CareRequestResponseDto updateCareRequest(Long id, CareRequestRequestDto dto) {
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

    private void applyDtoToEntity(CareRequestRequestDto dto, CareRequest entity) {
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setGenderPreference(dto.getGenderPreference());
        entity.setEmergencyPhone(dto.getEmergencyPhone());
        entity.setStatus(dto.getStatus());
        entity.setRequesterId(dto.getRequesterId());
        entity.setCarerId(dto.getCarerId());

        if (dto.getCareType() != null) {
            entity.setCareType(resolveCareType(dto.getCareType()));
        }

        entity.setPatientInfo(mergePatientInfo(dto.getPatientInfo(), entity.getPatientInfo()));
        entity.setPaymentInfo(mergePaymentInfo(dto.getPaymentInfo(), entity.getPaymentInfo()));
    }

    private CareType resolveCareType(CareTypeRequestDto dto) {
        if (dto == null) {
            return null;
        }
        if (dto.getId() != null) {
            return careTypeRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Care type not found with id " + dto.getId()));
        }
        CareType careType = new CareType();
        careType.setType(dto.getType());
        careType.setSpecialties(dto.getSpecialties());
        return careTypeRepository.save(careType);
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
        dto.setCareType(mapCareTypeDto(entity.getCareType()));
        dto.setPatientInfo(mapPatientInfoDto(entity.getPatientInfo()));
        dto.setPaymentInfo(mapPaymentInfoDto(entity.getPaymentInfo()));
        return dto;
    }

    private CareTypeResponseDto mapCareTypeDto(CareType entity) {
        if (entity == null) {
            return null;
        }
        CareTypeResponseDto dto = new CareTypeResponseDto();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setSpecialties(entity.getSpecialties());
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
}
