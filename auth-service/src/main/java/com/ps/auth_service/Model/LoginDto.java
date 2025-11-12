package com.ps.auth_service.Model;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {
    private String email;
    private String password;
}