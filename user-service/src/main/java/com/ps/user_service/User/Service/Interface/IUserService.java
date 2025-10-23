package com.ps.user_service.User.Service.Interface;

import java.util.List;
import java.util.Optional;

import com.ps.user_service.User.Dto.*;


public interface IUserService {
    Optional<UserResponseDto> findByEmail(String email);
    UserRegisDto newUser(UserRegisDto user);
    List<UserResponseDto> findAllUsers();
}