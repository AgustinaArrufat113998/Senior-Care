package com.ps.careRequest_service.Repository;

import com.ps.careRequest_service.Model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
}
