package com.ps.careRequest_service.Dto.Response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class PaymentInfoResponseDto {
    private BigDecimal amount;
    private String currency;
    private String method;
    private String status;
    private LocalDateTime paidAt;
    private String reference;
}
