package com.ps.user_service.User.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ps.user_service.User.Models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
