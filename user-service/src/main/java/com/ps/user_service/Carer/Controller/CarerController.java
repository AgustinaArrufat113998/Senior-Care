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

import com.ps.user_service.Carer.Dto.Request.CarerRequestDto;
import com.ps.user_service.Carer.Dto.Response.CarerResponseDto;
import com.ps.user_service.Carer.Service.Interface.ICarerService;

@RestController
@RequestMapping("/api/carer")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CarerController {

    private final ICarerService carerService;

    public CarerController(ICarerService carerService) {
        this.carerService = carerService;
    }

    @GetMapping
    public ResponseEntity<List<CarerResponseDto>> getAllCarers() {
        List<CarerResponseDto> carers = carerService.getAllCarers();
        if (carers.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(carers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarerResponseDto> getCarerById(@RequestParam(name = "id") Long id) {
        CarerResponseDto carer = carerService.getCarerById(id);
        if (carer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carer);
    }

    @PostMapping
    public ResponseEntity<CarerResponseDto> createCarer(@RequestBody CarerRequestDto request) {
        CarerResponseDto created = carerService.createCarer(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarerResponseDto> updateCarer(@RequestParam(name = "id") Long id, @RequestBody CarerRequestDto request) {
        CarerResponseDto updated = carerService.updateCarer(id, request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarer(@RequestParam(name = "id") Long id) {
        carerService.deleteCarer(id);
        return ResponseEntity.noContent().build();
    }
}