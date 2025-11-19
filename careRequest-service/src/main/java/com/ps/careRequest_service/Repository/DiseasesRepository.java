package com.ps.careRequest_service.Repository;

import com.ps.careRequest_service.Model.Diseases;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiseasesRepository extends JpaRepository<Diseases, Long> {
}
