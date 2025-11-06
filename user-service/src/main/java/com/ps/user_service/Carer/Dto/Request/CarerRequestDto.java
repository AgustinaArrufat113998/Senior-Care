package com.ps.user_service.Carer.Dto.Request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class CarerRequestDto {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private String experience;
    private String availability;
    private BigDecimal hourlyRate;

    private Long specialtyId;          // ID of selected specialty
    private Set<Long> skillIds;        // IDs of selected skills
}
