package com.ps.user_service.User.Service.Implementation;

import com.ps.user_service.User.Dto.UserRegisDto;
import com.ps.user_service.User.Dto.UserResponseDto;
import com.ps.user_service.User.Models.*;
import com.ps.user_service.User.Models.Enum.Role;
import com.ps.user_service.User.Repository.AddressRepository;
import com.ps.user_service.User.Repository.GenderRepository;
import com.ps.user_service.User.Repository.UserRepository;
import com.ps.user_service.User.Service.Interface.IUserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final GenderRepository genderRepository;
    private final AddressRepository addressRepository;

    public UserServiceImpl(UserRepository userRepository,
                           GenderRepository genderRepository,
                           AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.genderRepository = genderRepository;
        this.addressRepository = addressRepository;
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

        if (user.getPassword() == null || user.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        Gender gender = genderRepository.findByDescription(user.getGender())
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));

        Address address = new Address();
        address.setStreet(user.getStreet());
        address.setNumber(user.getNumber());
        address.setCity(user.getCity());
        addressRepository.save(address);

        User newUser = new User();
        newUser.setName(user.getName());
        newUser.setSurname(user.getSurname());
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setDni(user.getDni());
        newUser.setPhone(user.getPhone());
        newUser.setBirthDate(user.getBirthDate());
        newUser.setGender(gender);
        newUser.setAddress(address);
        newUser.setRole(Role.USER);

        User savedUser = userRepository.save(newUser);

        UserRegisDto dto = new UserRegisDto();
        dto.setName(savedUser.getName());
        dto.setSurname(savedUser.getSurname());
        dto.setUsername(savedUser.getUsername());
        dto.setEmail(savedUser.getEmail());
        dto.setPassword(savedUser.getPassword());
        dto.setDni(savedUser.getDni());
        dto.setStreet(savedUser.getAddress().getStreet());
        dto.setPhone(savedUser.getPhone());
        dto.setBirthDate(savedUser.getBirthDate());
        dto.setGender(savedUser.getGender().getDescription());

        return dto;
    }

    @Override
    public List<UserResponseDto> findAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDto(
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }
}
