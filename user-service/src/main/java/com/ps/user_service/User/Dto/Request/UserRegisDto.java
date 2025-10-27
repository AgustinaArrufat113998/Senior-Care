package com.ps.user_service.User.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisDto {
    private String name;
    private String surname;
    private String username;
    private String email;
    private String password;
    private String dni;
    private String phone;
    private Date birthDate;
    private Long genderId;
    private Long AddressId;
}
