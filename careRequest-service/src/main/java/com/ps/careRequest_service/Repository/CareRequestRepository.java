package com.ps.careRequest_service.Repository;

import com.ps.careRequest_service.Model.CareRequest;
import com.ps.careRequest_service.Model.Enum.StatusRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareRequestRepository extends JpaRepository<CareRequest, Long> {

    List<CareRequest> findByRequesterId(Long requesterId);

    List<CareRequest> findByCarerId(Long carerId);

    List<CareRequest> findByStatus(StatusRequest status);
}
