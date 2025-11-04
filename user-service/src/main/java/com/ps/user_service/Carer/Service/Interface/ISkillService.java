package com.ps.user_service.Carer.Service.Interface;

import java.util.List;

import com.ps.user_service.Carer.Dto.Request.SkillRequestDto;
import com.ps.user_service.Carer.Dto.Response.SkillResponseDto;

public interface ISkillService {
     List<SkillResponseDto> getAllSkills();

    SkillResponseDto getSkillById(Long id);

    SkillResponseDto createSkill(SkillRequestDto request);

    SkillResponseDto updateSkill(Long id, SkillRequestDto request);

    void deleteSkill(Long id);
}
