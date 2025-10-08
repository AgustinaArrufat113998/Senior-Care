package com.ps.SeniorCare.User.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ps.SeniorCare.User.Models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
