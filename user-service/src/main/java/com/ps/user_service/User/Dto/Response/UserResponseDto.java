package com.ps.user_service.User.Dto.Response;

import com.ps.user_service.User.Models.Enum.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private String email;
    private String password;
    private Role role;
}