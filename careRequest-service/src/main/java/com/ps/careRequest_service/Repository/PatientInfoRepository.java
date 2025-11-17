package com.ps.careRequest_service.Repository;

import com.ps.careRequest_service.Model.PatientInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientInfoRepository extends JpaRepository<PatientInfo, Long> {
}
