package com.ps.user_service.User.Dto.Response;

import lombok.Data;

@Data
public class AddressResponseDto {
    private Long id;
    private String number;
    private String floor;
    private String apartment;
    private StreetResponseDto street;
}
