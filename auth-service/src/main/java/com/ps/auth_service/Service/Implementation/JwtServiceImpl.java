package com.ps.auth_service.Service.Implementation;

import java.security.Key;

import com.ps.auth_service.Service.Interface.IJwtService;

public class JwtServiceImpl implements IJwtService {

    @Override
    public Key getSigningKey() {
        return null;
    }

    @Override
    public String generateToken(String username) {
        return null;
    }

    @Override
    public String extractUsername(String token) {
        return null;
    }

    @Override
    public boolean isTokenValid(String token, String username) {
        return true;
    }

    @Override
    public boolean isTokenExpired(String token) {
        return true;
    }
    
}
