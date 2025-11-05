package com.ps.SeniorCare.User.Dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CaregiverRegisDto {
    private String name;
    private String surname;
    private String username;
    private String email;
    private String dni;
    private String address;
    private String phone;
    private String gender;
    private String studies;
    private String experience;
    private String availability;
    private Double rate;
    private String secondaryContact;
}