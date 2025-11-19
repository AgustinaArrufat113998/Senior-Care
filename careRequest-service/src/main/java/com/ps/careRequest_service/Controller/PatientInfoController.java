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

import com.ps.careRequest_service.Dto.Request.PatientInfoRequestDto;
import com.ps.careRequest_service.Dto.Response.PatientInfoResponseDto;
import com.ps.careRequest_service.Service.Interface.IPatientInfoService;

@RestController
@RequestMapping("/patient-info")
public class PatientInfoController {

    private final IPatientInfoService patientInfoService;

    public PatientInfoController(IPatientInfoService patientInfoService) {
        this.patientInfoService = patientInfoService;
    }

    @PostMapping("/add")
    public ResponseEntity<PatientInfoResponseDto> createPatientInfo(@RequestBody PatientInfoRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientInfoService.createPatientInfo(requestDto));
    }

    @GetMapping("/all")
    public List<PatientInfoResponseDto> getAllPatientInfo() {
        return patientInfoService.getAllPatientInfos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientInfoResponseDto> getPatientInfoById(@PathVariable Long id) {
        return ResponseEntity.ok(patientInfoService.getPatientInfoById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientInfoResponseDto> updatePatientInfo(@PathVariable Long id,
            @RequestBody PatientInfoRequestDto requestDto) {
        return ResponseEntity.ok(patientInfoService.updatePatientInfo(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatientInfo(@PathVariable Long id) {
        patientInfoService.deletePatientInfo(id);
        return ResponseEntity.noContent().build();
    }
}
