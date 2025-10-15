package com.ps.SeniorCare.User.Service.Interface;

import java.security.Key;

public interface IJwtService {
    Key getSigningKey();
    String generateToken(String username);
    String extractUsername(String token);
    boolean isTokenValid(String token, String username);
    boolean isTokenExpired(String token);
    
}
