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

import com.ps.careRequest_service.Dto.Request.CareRequestRequestDto;
import com.ps.careRequest_service.Dto.Response.CareRequestResponseDto;
import com.ps.careRequest_service.Service.Interface.ICareRequestService;

@RestController
@RequestMapping("/care-requests")
public class CareRequestController {

    private final ICareRequestService careRequestService;

    public CareRequestController(ICareRequestService careRequestService) {
        this.careRequestService = careRequestService;
    }

    @PostMapping("/add")
    public ResponseEntity<CareRequestResponseDto> createCareRequest(@RequestBody CareRequestRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(careRequestService.createCareRequest(requestDto));
    }

    @GetMapping("/all")
    public List<CareRequestResponseDto> getAllCareRequests() {
        return careRequestService.getAllCareRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CareRequestResponseDto> getCareRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(careRequestService.getCareRequestById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CareRequestResponseDto> updateCareRequest(@PathVariable Long id,
            @RequestBody CareRequestRequestDto requestDto) {
        return ResponseEntity.ok(careRequestService.updateCareRequest(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCareRequest(@PathVariable Long id) {
        careRequestService.deleteCareRequest(id);
        return ResponseEntity.noContent().build();
    }
}
