package com.ps.user_service.Carer.Dto.Request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
public class CarerRequestDto{
    private Long userId;

    private String experience;
    private String availability;
    private BigDecimal hourlyRate;

    private Long specialtyId;         
    private Set<Long> skillIds;       
}
