package com.ps.SeniorCare.Carer.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarerRegisDto {
    private String name;
    private String surname;
    private String username;
    private String email;
    private String password;
    private String dni;
    private String address;
    private String phone;
    private String gender;
}
