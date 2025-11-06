// src/main/java/com/ps/auth_service/Security/CustomUserDetailsService.java
package com.ps.auth_service.Security;

import com.ps.auth_service.Model.RemoteUserDto;
import com.ps.auth_service.Service.Interface.IUserClientService;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final IUserClientService userClient;

    public CustomUserDetailsService(IUserClientService userClient) {
        this.userClient = userClient;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        RemoteUserDto ru = userClient.getByEmail(email);
        if (ru == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + email);
        }

        // rol opcional
        List<SimpleGrantedAuthority> auths =
                (ru.getRole() != null) ? List.of(new SimpleGrantedAuthority("ROLE_" + ru.getRole()))
                                       : List.of();

        return new org.springframework.security.core.userdetails.User(
                ru.getEmail(),
                ru.getPassword(), // BCrypt del user-service
                auths
        );
    }
}
