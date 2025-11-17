package com.ps.careRequest_service.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // no es necesario CSRF en APIs REST
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // todos los endpoints públicos
            );
        return http.build();
    }
    
}
