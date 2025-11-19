package com.ps.careRequest_service.Repository;

import com.ps.careRequest_service.Model.Condition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConditionRepository extends JpaRepository<Condition, Long> {
}
