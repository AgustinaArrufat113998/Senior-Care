package com.ps.user_service.User.Service.Implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ps.user_service.User.Dto.Request.FamiliarRequestDto;
import com.ps.user_service.User.Dto.Response.FamiliarResponseDto;
import com.ps.user_service.User.Models.Familiar;
import com.ps.user_service.User.Models.User;
import com.ps.user_service.User.Repository.FamiliarRepository;
import com.ps.user_service.User.Repository.UserRepository;
import com.ps.user_service.User.Service.Interface.IFamiliarService;

@Service
public class FamiliarServiceImpl implements IFamiliarService {

    private final FamiliarRepository familiarRepository;
    private final UserRepository userRepository;

    public FamiliarServiceImpl(FamiliarRepository familiarRepository, UserRepository userRepository) {
        this.familiarRepository = familiarRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public FamiliarResponseDto addFamiliar(FamiliarRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (familiarRepository.existsByDni(dto.getDni())) {
            throw new RuntimeException("Ya existe un familiar con ese DNI");
        }

        Familiar familiar = mapToEntity(dto, user);
        Familiar saved = familiarRepository.save(familiar);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FamiliarResponseDto> getFamiliaresByUser(Long userId) {
        return familiarRepository.findByUser_Id(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FamiliarResponseDto getFamiliar(Long id) {
        return familiarRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Familiar no encontrado"));
    }

    @Override
    @Transactional
    public FamiliarResponseDto updateFamiliar(Long id, FamiliarRequestDto dto) {
        return familiarRepository.findById(id)
                .map(existing -> {
                    // If DNI changes ensure uniqueness
                    if (!existing.getDni().equals(dto.getDni()) && familiarRepository.existsByDni(dto.getDni())) {
                        throw new RuntimeException("Ya existe un familiar con ese DNI");
                    }
                    User user = userRepository.findById(dto.getUserId())
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                    existing.setName(dto.getName());
                    existing.setDni(dto.getDni());
                    existing.setBirthdate(dto.getBirthdate());
                    existing.setRelationship(dto.getRelationship());
                    existing.setObservations(dto.getObservations());
                    existing.setPhone(dto.getPhone());
                    existing.setEmail(dto.getEmail());
                    existing.setUser(user);
                    return mapToResponse(familiarRepository.save(existing));
                })
                .orElseThrow(() -> new RuntimeException("Familiar no encontrado"));
    }

    @Override
    @Transactional
    public void deleteFamiliar(Long id) {
        familiarRepository.deleteById(id);
    }

    private Familiar mapToEntity(FamiliarRequestDto dto, User user) {
        Familiar fam = new Familiar();
        fam.setName(dto.getName());
        fam.setDni(dto.getDni());
        fam.setBirthdate(dto.getBirthdate());
        fam.setRelationship(dto.getRelationship());
        fam.setObservations(dto.getObservations());
        fam.setPhone(dto.getPhone());
        fam.setEmail(dto.getEmail());
        fam.setUser(user);
        return fam;
    }

    private FamiliarResponseDto mapToResponse(Familiar familiar) {
        return new FamiliarResponseDto(
                familiar.getId(),
                familiar.getName(),
                familiar.getDni(),
                familiar.getBirthdate(),
                familiar.getRelationship(),
                familiar.getObservations(),
                familiar.getPhone(),
                familiar.getEmail(),
                familiar.getUser() != null ? familiar.getUser().getId() : null
        );
    }
}
