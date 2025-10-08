package com.ps.SeniorCare.User.Service.Interface;

import java.util.Optional;

import com.ps.SeniorCare.User.Dto.UserDto.LoginDto;
import com.ps.SeniorCare.User.Dto.UserDto.UserRegisDto;
import com.ps.SeniorCare.User.Dto.UserDto.UserResponseDto;

public interface IUserService {
    Optional<UserResponseDto> findByEmail(String email);
    UserRegisDto newUser(UserRegisDto user);
    Optional<UserResponseDto> findAllUsers();
    Optional<LoginDto> login(String email, String password);
}