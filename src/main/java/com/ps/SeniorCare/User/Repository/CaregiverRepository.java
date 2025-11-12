package com.ps.SeniorCare.User.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ps.SeniorCare.User.Models.Caregiver;

public interface CaregiverRepository extends JpaRepository<Caregiver, Long> {

    Optional<Caregiver> findByEmail(String email);

    Optional<Caregiver> findByDni(String dni);

    Optional<Caregiver> findByUsername(String username);
}
