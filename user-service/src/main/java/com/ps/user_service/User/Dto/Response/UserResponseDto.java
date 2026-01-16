package com.ps.user_service.User.Dto.Response;

import com.ps.user_service.User.Models.Enum.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private Long id;
    private String email;
    private String password;
    private Role role;
    private LocalDateTime createdAt;
}
