package com.ps.careRequest_service.Repository;

import com.ps.careRequest_service.Model.CareType;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareTypeRepository extends JpaRepository<CareType, Long> {
}
