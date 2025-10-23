package com.ps.user_service.User.Service.Interface;

import com.ps.user_service.User.Models.Gender;

import java.util.List;
import java.util.Optional;

public interface IGenderService {
    List<Gender> findAll();
    Optional<Gender> findById(Long id);
    Gender save(Gender gender);
    Gender update(Long id, Gender gender);
    void delete(Long id);
}
