package com.ps.user_service.User.Controller;

import com.ps.user_service.User.Models.Gender;
import com.ps.user_service.User.Service.Interface.IGenderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genders")
public class GenderController {

    private final IGenderService genderService;

    public GenderController(IGenderService genderService) {
        this.genderService = genderService;
    }

    @GetMapping
    public List<Gender> getAll() {
        return genderService.findAll();
    }

    @GetMapping("/{id}")
    public Gender getById(@PathVariable Long id) {
        return genderService.findById(id)
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));
    }

    @PostMapping
    public Gender create(@RequestBody Gender gender) {
        return genderService.save(gender);
    }

    @PutMapping("/{id}")
    public Gender update(@PathVariable Long id, @RequestBody Gender gender) {
        return genderService.update(id, gender);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        genderService.delete(id);
    }
}
