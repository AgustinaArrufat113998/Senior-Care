package com.ps.user_service.Carer.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ps.user_service.Carer.Dto.Request.SkillRequestDto;
import com.ps.user_service.Carer.Dto.Response.SkillResponseDto;
import com.ps.user_service.Carer.Service.Interface.ISkillService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/skill")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SkillController {
    private final ISkillService skillService;

    public SkillController(ISkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<SkillResponseDto>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("{id}")
    public ResponseEntity<SkillResponseDto> getSkillById(@RequestParam Long id) {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<SkillResponseDto> createSkill(@RequestBody SkillRequestDto request) {
        return ResponseEntity.ok(skillService.createSkill(request));
    }

    @PutMapping("/update")
    public ResponseEntity<SkillResponseDto> updateSkill(@RequestParam Long id, @RequestBody SkillRequestDto request) {
        return ResponseEntity.ok(skillService.updateSkill(id, request));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteSkill(@RequestParam Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
