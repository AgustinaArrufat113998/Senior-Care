package com.ps.user_service.User.Dto.Response;

import java.time.LocalDateTime;
import java.util.Date;

import com.ps.user_service.User.Models.Enum.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponseDto {
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String email;
    private String dni;
    private String phone;
    private Date birthDate;
    private Role role;
    private LocalDateTime createdAt;
    private AddressResponseDto address;
}
