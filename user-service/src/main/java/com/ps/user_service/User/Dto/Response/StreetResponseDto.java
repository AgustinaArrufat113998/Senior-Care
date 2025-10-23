package com.ps.user_service.User.Dto.Response;

import lombok.Data;

@Data
public class StreetResponseDto {
    private Long id;
    private String name;
    private String number;
    private CityResponseDto city;
}
