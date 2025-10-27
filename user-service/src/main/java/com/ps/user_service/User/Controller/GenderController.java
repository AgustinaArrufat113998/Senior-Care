package com.ps.user_service.User.Controller;

import com.ps.user_service.User.Dto.GenderDto;
import com.ps.user_service.User.Service.Interface.IGenderService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class GenderController {

    private final IGenderService genderService;

    public GenderController(IGenderService genderService) {
        this.genderService = genderService;
    }

    @GetMapping
    public ResponseEntity<List<GenderDto>> getAll() {
        return ResponseEntity.ok(genderService.findAll());
    }

    @PostMapping
    public ResponseEntity<GenderDto> create(@RequestBody GenderDto gender) {
        return ResponseEntity.ok(genderService.save(gender));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenderDto> update(@RequestParam Long id, @RequestBody GenderDto gender) {
        return ResponseEntity.ok(genderService.update(id, gender));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestParam Long id) {
        try {
            genderService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
