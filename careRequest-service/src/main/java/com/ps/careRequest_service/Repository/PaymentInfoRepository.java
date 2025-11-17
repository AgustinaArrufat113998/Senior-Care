package com.ps.careRequest_service.Repository;

import com.ps.careRequest_service.Model.PaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {
}
