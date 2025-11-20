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

import com.ps.careRequest_service.Dto.Request.AllergyRequestDto;
import com.ps.careRequest_service.Dto.Response.AllergyResponseDto;
import com.ps.careRequest_service.Service.Interface.IAllergyService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/allergies")
public class AllergyController {

    private final IAllergyService allergyService;

    public AllergyController(IAllergyService allergyService) {
        this.allergyService = allergyService;
    }

    @PostMapping
    public ResponseEntity<AllergyResponseDto> createAllergy(@RequestBody AllergyRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(allergyService.createAllergy(requestDto));
    }

    @GetMapping
    public List<AllergyResponseDto> getAllAllergies() {
        return allergyService.getAllAllergies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AllergyResponseDto> getAllergyById(@PathVariable Long id) {
        return ResponseEntity.ok(allergyService.getAllergyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AllergyResponseDto> updateAllergy(@PathVariable Long id,
            @RequestBody AllergyRequestDto requestDto) {
        return ResponseEntity.ok(allergyService.updateAllergy(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAllergy(@PathVariable Long id) {
        allergyService.deleteAllergy(id);
        return ResponseEntity.noContent().build();
    }
}
