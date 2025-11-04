package com.ps.user_service.User.Service.Implementation;

import com.ps.user_service.User.Dto.GenderDto;
import com.ps.user_service.User.Models.Gender;
import com.ps.user_service.User.Repository.GenderRepository;
import com.ps.user_service.User.Service.Interface.IGenderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenderServiceImpl implements IGenderService {

    private final GenderRepository genderRepository;

    public GenderServiceImpl(GenderRepository genderRepository) {
        this.genderRepository = genderRepository;
    }

    @Override
    public GenderDto save(GenderDto gender) {
        Gender newGender = new Gender();
        newGender.setDescription(gender.getDescription());
        genderRepository.save(newGender);

        GenderDto response = new GenderDto();
        response.setDescription(newGender.getDescription());

        return response;
    }

    @Override
    public List<GenderDto> findAll() {
        List<Gender> genders = genderRepository.findAll();

        return genders.stream().map(g -> {
            GenderDto dto = new GenderDto();
            dto.setId(g.getId());
            dto.setDescription(g.getDescription());
            return dto;
        }).toList();
    }

    @Override
    public GenderDto update(Long id, GenderDto gender) {
        Gender existing = genderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));
        existing.setDescription(gender.getDescription());
        
        genderRepository.save(existing);

        GenderDto response = new GenderDto();
        response.setDescription(existing.getDescription());
        
        return response;
    }

    @Override
    public void delete(Long id) {
        if (!genderRepository.existsById(id)) {
            throw new RuntimeException("Género no encontrado");
        }
        genderRepository.deleteById(id);
        
    }
}
