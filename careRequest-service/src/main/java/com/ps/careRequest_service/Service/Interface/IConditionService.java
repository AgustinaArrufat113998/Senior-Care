package com.ps.careRequest_service.Service.Interface;

import java.util.List;

import com.ps.careRequest_service.Dto.Request.ConditionRequestDto;
import com.ps.careRequest_service.Dto.Response.ConditionResponseDto;

public interface IConditionService {
    ConditionResponseDto createCondition(ConditionRequestDto conditionRequestDto);
    List<ConditionResponseDto> getAllConditions();
    ConditionResponseDto getConditionById(Long id);
    ConditionResponseDto updateCondition(Long id, ConditionRequestDto conditionRequestDto);
    void deleteCondition(Long id);
}
