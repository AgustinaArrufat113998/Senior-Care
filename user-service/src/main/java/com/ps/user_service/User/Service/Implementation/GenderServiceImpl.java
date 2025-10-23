package com.ps.user_service.User.Service.Implementation;

import com.ps.user_service.User.Models.Gender;
import com.ps.user_service.User.Repository.GenderRepository;
import com.ps.user_service.User.Service.Interface.IGenderService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GenderServiceImpl implements IGenderService {

    private final GenderRepository genderRepository;

    public GenderServiceImpl(GenderRepository genderRepository) {
        this.genderRepository = genderRepository;
    }

    @Override
    public List<Gender> findAll() {
        return genderRepository.findAll();
    }

    @Override
    public Optional<Gender> findById(Long id) {
        return genderRepository.findById(id);
    }

    @Override
    public Gender save(Gender gender) {
        return genderRepository.save(gender);
    }

    @Override
    public Gender update(Long id, Gender gender) {
        Gender existing = genderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));
        existing.setDescription(gender.getDescription());
        return genderRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        genderRepository.deleteById(id);
    }
}
