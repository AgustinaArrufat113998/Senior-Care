package com.ps.user_service.User.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ps.user_service.User.Models.Gender;

public interface GenderRepository extends JpaRepository<Gender, Long> {
    Optional<Gender> findByDescription(String description);
}