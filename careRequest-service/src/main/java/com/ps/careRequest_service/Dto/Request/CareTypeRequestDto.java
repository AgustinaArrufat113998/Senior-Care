package com.ps.careRequest_service.Dto.Request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CareTypeRequestDto {
    private Long id;
    private String type;
    private String specialty;
}
