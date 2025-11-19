package com.ps.careRequest_service.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ps.careRequest_service.Dto.Request.ConditionRequestDto;
import com.ps.careRequest_service.Dto.Response.ConditionResponseDto;
import com.ps.careRequest_service.Model.Condition;
import com.ps.careRequest_service.Repository.ConditionRepository;
import com.ps.careRequest_service.Service.Interface.IConditionService;

@Service
public class ConditionServiceImpl implements IConditionService {
    private final ConditionRepository conditionRepository;

    public ConditionServiceImpl(ConditionRepository conditionRepository) {
        this.conditionRepository = conditionRepository;
    }

    @Override
    public ConditionResponseDto createCondition(ConditionRequestDto conditionRequestDto) {
        Condition condition = new Condition();
        condition.setDesc(conditionRequestDto.getCondition());
        Condition savedCondition = conditionRepository.save(condition);
        return mapToDto(savedCondition);
    }

    @Override
    public List<ConditionResponseDto> getAllConditions() {
        return conditionRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ConditionResponseDto getConditionById(Long id) {
        return conditionRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Condition not found with id " + id));
    }

    @Override
    public ConditionResponseDto updateCondition(Long id, ConditionRequestDto conditionRequestDto) {
        Condition existingCondition = conditionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Condition not found with id " + id));

        existingCondition.setDesc(conditionRequestDto.getCondition());
        Condition updatedCondition = conditionRepository.save(existingCondition);
        return mapToDto(updatedCondition);
    }

    @Override
    public void deleteCondition(Long id) {
        if (!conditionRepository.existsById(id)) {
            throw new RuntimeException("Condition not found with id " + id);
        }
        conditionRepository.deleteById(id);
    }

    private ConditionResponseDto mapToDto(Condition condition) {
        ConditionResponseDto responseDto = new ConditionResponseDto();
        responseDto.setId(condition.getId());
        responseDto.setCondition(condition.getDesc());
        return responseDto;
    }
}
