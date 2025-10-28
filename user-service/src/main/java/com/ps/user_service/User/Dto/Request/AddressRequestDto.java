package com.ps.user_service.User.Dto.Request;

import lombok.Data;

@Data
public class AddressRequestDto {
    private String number;
    private String floor;
    private String apartment;
    private Long streetId;
}
