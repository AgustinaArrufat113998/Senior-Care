package com.ps.user_service.User.Controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ps.user_service.User.Dto.Request.FamiliarRequestDto;
import com.ps.user_service.User.Dto.Response.FamiliarResponseDto;
import com.ps.user_service.User.Service.Interface.IFamiliarService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/family")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FamiliarController {

    private final IFamiliarService familiarService;

    public FamiliarController(IFamiliarService familiarService) {
        this.familiarService = familiarService;
    }

    @PostMapping
    public ResponseEntity<FamiliarResponseDto> addFamiliar(@Valid @RequestBody FamiliarRequestDto dto) {
        FamiliarResponseDto created = familiarService.addFamiliar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<FamiliarResponseDto>> getFamiliares(@RequestParam(name = "userId") Long userId) {
        List<FamiliarResponseDto> list = familiarService.getFamiliaresByUser(userId);
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FamiliarResponseDto> getFamiliar(@PathVariable("id") Long id) {
        FamiliarResponseDto familiar = familiarService.getFamiliar(id);
        return ResponseEntity.ok(familiar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FamiliarResponseDto> updateFamiliar(@PathVariable("id") Long id,
                                                              @Valid @RequestBody FamiliarRequestDto dto) {
        FamiliarResponseDto updated = familiarService.updateFamiliar(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFamiliar(@PathVariable("id") Long id) {
        familiarService.deleteFamiliar(id);
        return ResponseEntity.noContent().build();
    }
}
