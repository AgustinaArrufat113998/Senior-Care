package com.ps.user_service.Carer.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ps.user_service.Carer.Model.Specialty;

public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {  }
