package com.ps.careRequest_service.Dto.Request;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CareTypeRequestDto {
    private Long id;
    private String type;
    private List<String> specialties;
}
