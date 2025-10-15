package com.ps.SeniorCare.User.Service.Implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ps.SeniorCare.User.Dto.UserDto.LoginDto;
import com.ps.SeniorCare.User.Dto.UserDto.UserRegisDto;
import com.ps.SeniorCare.User.Dto.UserDto.UserResponseDto;
import com.ps.SeniorCare.User.Models.User;
import com.ps.SeniorCare.User.Repository.UserRepository;
import com.ps.SeniorCare.User.Service.Interface.IUserService;

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
        // contraseña (minimo 8 caracteres)
        if (user.getPassword() == null || user.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        
        // Verifica si ya existe un usuario con ese email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado"); 
        }

        User newUser = new User();
        newUser.setName(user.getName());
        newUser.setSurname(user.getSurname());
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setDni(user.getDni());
        newUser.setAddress(user.getAddress());
        newUser.setPhone(user.getPhone());  
        newUser.setBirthDate(user.getBirthDate());
        newUser.setGender(user.getGender());
        newUser.setRole("USER");

        User savedUser = userRepository.save(newUser);

        return new UserRegisDto(
            savedUser.getName(),
            savedUser.getSurname(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getPassword(),
            savedUser.getDni(),
            savedUser.getAddress(),
            savedUser.getPhone(),
            savedUser.getBirthDate(),
            savedUser.getGender()
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
