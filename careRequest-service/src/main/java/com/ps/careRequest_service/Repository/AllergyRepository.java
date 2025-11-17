package com.ps.careRequest_service.Repository;

import com.ps.careRequest_service.Model.Allergy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllergyRepository extends JpaRepository<Allergy, Long> {
}
