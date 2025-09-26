package com.ps.SeniorCare.Service.Implementation;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ps.SeniorCare.Dto.UserDto.UserRegisDto;
import com.ps.SeniorCare.Dto.UserDto.UserResponseDto;
import com.ps.SeniorCare.Models.User;
import com.ps.SeniorCare.Repository.UserRepository;
import com.ps.SeniorCare.Service.Interface.IUserService;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<UserResponseDto> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> new UserResponseDto(
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole()
                ));
    }


    @Override
    public UserRegisDto newUser(UserRegisDto user) {
        User newUser = new User();

        newUser.setUsername(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setRole(user.getRole());

        User savedUser = userRepository.save(newUser);
        
        return new UserRegisDto(
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getPassword(),
            savedUser.getRole()
        );
    }
    
}
