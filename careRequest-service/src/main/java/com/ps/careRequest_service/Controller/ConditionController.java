package com.ps.careRequest_service.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ps.careRequest_service.Dto.Request.ConditionRequestDto;
import com.ps.careRequest_service.Dto.Response.ConditionResponseDto;
import com.ps.careRequest_service.Service.Interface.IConditionService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/conditions")
public class ConditionController {

    private final IConditionService conditionService;

    public ConditionController(IConditionService conditionService) {
        this.conditionService = conditionService;
    }

    @PostMapping
    public ResponseEntity<ConditionResponseDto> createCondition(@RequestBody ConditionRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(conditionService.createCondition(requestDto));
    }

    @GetMapping
    public List<ConditionResponseDto> getAllConditions() {
        return conditionService.getAllConditions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConditionResponseDto> getConditionById(@PathVariable Long id) {
        return ResponseEntity.ok(conditionService.getConditionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConditionResponseDto> updateCondition(@PathVariable Long id,
            @RequestBody ConditionRequestDto requestDto) {
        return ResponseEntity.ok(conditionService.updateCondition(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCondition(@PathVariable Long id) {
        conditionService.deleteCondition(id);
        return ResponseEntity.noContent().build();
    }
}
