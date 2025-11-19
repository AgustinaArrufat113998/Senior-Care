package com.ps.careRequest_service.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ps.careRequest_service.Dto.Request.DiseasesRequestDto;
import com.ps.careRequest_service.Dto.Response.DiseasesResponseDto;
import com.ps.careRequest_service.Service.Interface.IDiseaseService;

@RestController
@RequestMapping("/diseases")
public class DiseaseController {

    private final IDiseaseService diseaseService;

    public DiseaseController(IDiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    @PostMapping
    public ResponseEntity<DiseasesResponseDto> createDisease(@RequestBody DiseasesRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(diseaseService.createDisease(requestDto));
    }

    @GetMapping
    public List<DiseasesResponseDto> getAllDiseases() {
        return diseaseService.getAllDiseases();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiseasesResponseDto> getDiseaseById(@PathVariable Long id) {
        return ResponseEntity.ok(diseaseService.getDiseaseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiseasesResponseDto> updateDisease(@PathVariable Long id,
            @RequestBody DiseasesRequestDto requestDto) {
        return ResponseEntity.ok(diseaseService.updateDisease(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDisease(@PathVariable Long id) {
        diseaseService.deleteDisease(id);
        return ResponseEntity.noContent().build();
    }
}
