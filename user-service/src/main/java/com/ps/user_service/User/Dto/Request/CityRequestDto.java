package com.ps.user_service.User.Dto.Request;

import lombok.Data;

@Data
public class CityRequestDto {
    private String name;
    private Long countryId;
}
