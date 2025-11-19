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

import com.ps.careRequest_service.Dto.Request.CareTypeRequestDto;
import com.ps.careRequest_service.Dto.Response.CareTypeResponseDto;
import com.ps.careRequest_service.Service.Interface.ICareTypeService;

@RestController
@RequestMapping("/care-types")
public class CareTypeController {

    private final ICareTypeService careTypeService;

    public CareTypeController(ICareTypeService careTypeService) {
        this.careTypeService = careTypeService;
    }

    @PostMapping("/add")
    public ResponseEntity<CareTypeResponseDto> createCareType(@RequestBody CareTypeRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(careTypeService.createCareType(requestDto));
    }

    @GetMapping("/all")
    public List<CareTypeResponseDto> getAllCareTypes() {
        return careTypeService.getAllCareTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CareTypeResponseDto> getCareTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(careTypeService.getCareTypeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CareTypeResponseDto> updateCareType(@PathVariable Long id,
            @RequestBody CareTypeRequestDto requestDto) {
        return ResponseEntity.ok(careTypeService.updateCareType(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCareType(@PathVariable Long id) {
        careTypeService.deleteCareType(id);
        return ResponseEntity.noContent().build();
    }
}
