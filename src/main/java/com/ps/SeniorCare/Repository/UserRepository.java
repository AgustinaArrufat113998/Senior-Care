package com.ps.SeniorCare.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ps.SeniorCare.Models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
