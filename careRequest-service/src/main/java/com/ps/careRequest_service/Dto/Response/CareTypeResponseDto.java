package com.ps.careRequest_service.Dto.Response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CareTypeResponseDto {
    private Long id;
    private String type;
    private String specialty;
}
