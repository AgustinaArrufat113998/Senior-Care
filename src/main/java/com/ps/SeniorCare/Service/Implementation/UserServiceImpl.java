package com.ps.SeniorCare.Service.Implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ps.SeniorCare.Dto.UserDto.LoginDto;
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
        // Verifica si ya existe un usuario con ese email

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado"); 
        }

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

    @Override
    public Optional<UserResponseDto> findAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDto(
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole()
                ))
                .findFirst();
    }

    @Override
    public Optional<LoginDto> login(String email, String password) {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            if (user.getEmail().equals(email) && user.getPassword().equals(password)) {
                return Optional.of(new LoginDto(user.getEmail(), user.getPassword()));
            }
        }
        return Optional.empty();
    }        
}
