package com.ps.user_service.User.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ps.user_service.User.Models.Familiar;

public interface FamiliarRepository extends JpaRepository<Familiar, Long> {
    List<Familiar> findByUser_Id(Long userId);
    boolean existsByDni(String dni);
}
