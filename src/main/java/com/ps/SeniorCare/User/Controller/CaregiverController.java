package com.ps.SeniorCare.User.Controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ps.SeniorCare.User.Dto.UserDto.CaregiverRegisDto;
import com.ps.SeniorCare.User.Dto.UserDto.CaregiverResponseDto;
import com.ps.SeniorCare.User.Dto.UserDto.CaregiverUpdateDto;
import com.ps.SeniorCare.User.Service.Interface.ICaregiverService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/caregiver")
public class CaregiverController {

    private final ICaregiverService caregiverService;

    public CaregiverController(ICaregiverService caregiverService) {
        this.caregiverService = caregiverService;
    }

    @PostMapping("/register")
    public ResponseEntity<CaregiverRegisDto> register(@RequestBody CaregiverRegisDto dto) {
        return ResponseEntity.ok(caregiverService.registerCaregiver(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CaregiverResponseDto>> getAll() {
        List<CaregiverResponseDto> caregivers = caregiverService.findAll();
        return caregivers.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(caregivers);
    }

    @GetMapping("/by-email")
    public ResponseEntity<CaregiverResponseDto> getByEmail(@RequestParam String email) {
        return caregiverService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CaregiverResponseDto> update(
            @PathVariable Long id,
            @RequestBody CaregiverUpdateDto dto) {
        return ResponseEntity.ok(caregiverService.updateCaregiver(id, dto));
    }

    @GetMapping("/by-dni")
public ResponseEntity<CaregiverResponseDto> getByDni(@RequestParam String dni) {
    return caregiverService.findByDni(dni)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

@GetMapping("/by-username")
public ResponseEntity<CaregiverResponseDto> getByUsername(@RequestParam String username) {
    return caregiverService.findByUsername(username)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

}
