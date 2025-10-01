package com.ps.SeniorCare.Dto.UserDto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisDto {

    private String name;
    private String email;
    private String password;
    private String dni;
    private String phone;
    private Date birthDate;
    private String gender;
    

    //private String role;
}
