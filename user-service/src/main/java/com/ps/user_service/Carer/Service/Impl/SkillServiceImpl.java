package com.ps.user_service.Carer.Service.Impl;

import com.ps.user_service.Carer.Dto.Request.SkillRequestDto;
import com.ps.user_service.Carer.Dto.Response.SkillResponseDto;
import com.ps.user_service.Carer.Model.Skill;
import com.ps.user_service.Carer.Repository.SkillRepository;
import com.ps.user_service.Carer.Service.Interface.ISkillService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillServiceImpl implements ISkillService {

    private final SkillRepository skillRepository;
    private final ModelMapper mapper;

    public SkillServiceImpl(SkillRepository skillRepository, ModelMapper mapper) {
        this.skillRepository = skillRepository;
        this.mapper = mapper;
    }

    @Override
    public List<SkillResponseDto> getAllSkills() {
        return skillRepository.findAll()
                .stream()
                .map(skill -> mapper.map(skill, SkillResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public SkillResponseDto getSkillById(Long id) {
        return skillRepository.findById(id)
                .map(skill -> mapper.map(skill, SkillResponseDto.class))
                .orElse(null);
    }

    @Override
    public SkillResponseDto createSkill(SkillRequestDto request) {
        Skill skill = new Skill();
        skill.setName(request.getName());
        Skill saved = skillRepository.save(skill);
        return mapper.map(saved, SkillResponseDto.class);
    }

    @Override
    public SkillResponseDto updateSkill(Long id, SkillRequestDto request) {
        return skillRepository.findById(id)
                .map(existing -> {
                    mapper.map(request, existing);
                    Skill updated = skillRepository.save(existing);
                    return mapper.map(updated, SkillResponseDto.class);
                })
                .orElse(null);
    }

    @Override
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }
}
