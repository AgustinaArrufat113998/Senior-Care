package com.ps.user_service.Carer.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ps.user_service.Carer.Model.Carer;

public interface CarerRepository extends JpaRepository<Carer, Long> {  }
