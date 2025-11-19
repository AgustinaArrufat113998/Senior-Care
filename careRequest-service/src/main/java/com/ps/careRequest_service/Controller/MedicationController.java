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

import com.ps.careRequest_service.Dto.Request.MedicationRequestDto;
import com.ps.careRequest_service.Dto.Response.MedicationResponseDto;
import com.ps.careRequest_service.Service.Interface.IMedicationService;

@RestController
@RequestMapping("/medications")
public class MedicationController {

    private final IMedicationService medicationService;

    public MedicationController(IMedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @PostMapping
    public ResponseEntity<MedicationResponseDto> createMedication(@RequestBody MedicationRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicationService.createMedication(requestDto));
    }

    @GetMapping
    public List<MedicationResponseDto> getAllMedications() {
        return medicationService.getAllMedications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicationResponseDto> getMedicationById(@PathVariable Long id) {
        return ResponseEntity.ok(medicationService.getMedicationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicationResponseDto> updateMedication(@PathVariable Long id,
            @RequestBody MedicationRequestDto requestDto) {
        return ResponseEntity.ok(medicationService.updateMedication(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        medicationService.deleteMedication(id);
        return ResponseEntity.noContent().build();
    }
}
