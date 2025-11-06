package com.ps.user_service.Carer.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ps.user_service.Carer.Model.Carer;
import com.ps.user_service.User.Models.User;

public interface CarerRepository extends JpaRepository<Carer, Long> {
    boolean existsByUser(User user);
}
