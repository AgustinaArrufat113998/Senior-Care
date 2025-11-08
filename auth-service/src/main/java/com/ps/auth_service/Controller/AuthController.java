package com.ps.auth_service.Controller;

import com.ps.auth_service.Model.LoginDto;
import com.ps.auth_service.Model.RemoteUserDto;
import com.ps.auth_service.Security.JwtTokenUtil;
import com.ps.auth_service.Service.Interface.IUserClientService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IUserClientService userClientService;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(IUserClientService userClientService,
                          JwtTokenUtil jwtTokenUtil,
                          PasswordEncoder passwordEncoder) {
        this.userClientService = userClientService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginDto loginDto) {
        RemoteUserDto user = userClientService.getByEmail(loginDto.getEmail());

        if (user == null) {
            throw new RuntimeException("Usuario no encontrado con email: " + loginDto.getEmail());
        }

        // ✅ comparar password en texto plano vs hash bcrypt
        boolean passwordOk = passwordEncoder.matches(loginDto.getPassword(), user.getPassword());
        if (!passwordOk) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        // ✅ generar JWT (podés incluir el rol si querés)
        String token = jwtTokenUtil.generateToken(user.getEmail(), user.getRole());

        return Map.of(
                "token", token,
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }
}
