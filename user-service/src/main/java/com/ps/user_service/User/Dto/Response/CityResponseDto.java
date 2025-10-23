package com.ps.user_service.User.Dto.Response;

import lombok.Data;

@Data
public class CityResponseDto {
    private Long id;
    private String name;
    private CountryResponseDto country;
}
