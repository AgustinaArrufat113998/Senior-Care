package com.ps.user_service.User.Service.Interface;

import java.util.List;
import java.util.Optional;

import com.ps.user_service.User.Dto.Request.UserRegisDto;
import com.ps.user_service.User.Dto.Response.UserProfileResponseDto;
import com.ps.user_service.User.Dto.Response.UserResponseDto;


public interface IUserService {
    Optional<UserResponseDto> findByEmail(String email);
    Optional<UserProfileResponseDto> findProfileById(Long id);
    UserRegisDto newUser(UserRegisDto user);
    List<UserResponseDto> findAllUsers();
}
