// src/main/java/com/ps/auth_service/Model/RemoteUserDto.java
package com.ps.auth_service.Model;

import lombok.Data;

@Data
public class RemoteUserDto {
    private Long id;
    private String email;
    private String password; // DEBE venir encriptada (BCrypt)
    private String role;     // opcional, si querés meter roles al JWT
}
