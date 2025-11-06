package com.ps.user_service.Carer.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ps.user_service.Carer.Dto.Request.SpecialtyRequestDto;
import com.ps.user_service.Carer.Dto.Response.SpecialtyResponseDto;
import com.ps.user_service.Carer.Service.Interface.ISpecialtyService;


@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/specialty")
public class SpecialtyController {
    private final ISpecialtyService specialtyService;

    public SpecialtyController(ISpecialtyService specialtyService) {
        this.specialtyService = specialtyService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<SpecialtyResponseDto>> getAllSpecialties() {
        return ResponseEntity.ok(specialtyService.getAllSpicialties());
    }

    @PostMapping("/create")
    public ResponseEntity<SpecialtyResponseDto> createSpecialty(@RequestBody SpecialtyRequestDto request) {
        return ResponseEntity.ok(specialtyService.createSpecialty(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecialtyResponseDto> getSpecialtyById(@RequestParam Long id) {
        return ResponseEntity.ok(specialtyService.getSpeciltyById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SpecialtyResponseDto> updateSpecialty(@RequestParam Long id, @RequestBody SpecialtyRequestDto request) {
        return ResponseEntity.ok(specialtyService.updateSpecialty(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSpecialty(@RequestParam Long id) {
        specialtyService.deleteSpecialty(id);
        return ResponseEntity.noContent().build();
    }
}
