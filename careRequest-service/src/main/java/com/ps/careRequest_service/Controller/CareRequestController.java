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

import com.ps.careRequest_service.Dto.Request.AssaignRequestDto;
import com.ps.careRequest_service.Dto.Request.CareRequestDto;
import com.ps.careRequest_service.Dto.Request.StatusRequestDto;
import com.ps.careRequest_service.Dto.Response.CareResponseDto;
import com.ps.careRequest_service.Service.Interface.ICareRequestService;

@RestController
@RequestMapping("/care-requests")
public class CareRequestController {

    private final ICareRequestService careRequestService;

    public CareRequestController(ICareRequestService careRequestService) {
        this.careRequestService = careRequestService;
    }

    @PostMapping("/add")
    public ResponseEntity<CareResponseDto> createCareRequest(@RequestBody CareRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(careRequestService.createCareRequest(requestDto));
    }

    @GetMapping("/all")
    public List<CareResponseDto> getAllCareRequests() {
        return careRequestService.getAllCareRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CareResponseDto> getCareRequestById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(careRequestService.getCareRequestById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CareResponseDto> updateCareRequest(
            @PathVariable("id") Long id,
            @RequestBody CareRequestDto requestDto) {
        return ResponseEntity.ok(careRequestService.updateCareRequest(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCareRequest(@PathVariable("id") Long id) {
        careRequestService.deleteCareRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<StatusRequestDto> getCareRequestStatus(@PathVariable("id") Long id) {
        return ResponseEntity.ok(careRequestService.getCareRequestStatus(id));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<StatusRequestDto> UpdateCareRequestStatus(
            @PathVariable("id") Long id,
            @RequestBody StatusRequestDto statusRequestDto) {
        return ResponseEntity.ok(careRequestService.updateCareRequestStatus(id, statusRequestDto));
    }

    @PutMapping("/assign/{requestId}")
    public ResponseEntity<AssaignRequestDto> assignCarerToRequest(
            @PathVariable("requestId") Long requestId,
            @RequestBody AssaignRequestDto assaignRequestDto) {
        return ResponseEntity.ok(careRequestService.assignCarerToRequest(requestId, assaignRequestDto));
    }
}
