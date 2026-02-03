package com.ps.user_service.User.Service.Implementation;

import com.ps.user_service.User.Dto.Request.UserRegisDto;
import com.ps.user_service.User.Dto.Response.AddressResponseDto;
import com.ps.user_service.User.Dto.Response.CityResponseDto;
import com.ps.user_service.User.Dto.Response.CountryResponseDto;
import com.ps.user_service.User.Dto.Response.StreetResponseDto;
import com.ps.user_service.User.Dto.Response.UserProfileResponseDto;
import com.ps.user_service.User.Dto.Response.UserResponseDto;
import com.ps.user_service.User.Models.*;
import com.ps.user_service.User.Models.Enum.Role;
import com.ps.user_service.User.Repository.AddressRepository;
import com.ps.user_service.User.Repository.GenderRepository;
import com.ps.user_service.User.Repository.UserRepository;
import com.ps.user_service.User.Service.Interface.IUserService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final GenderRepository genderRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder; 

    public UserServiceImpl(UserRepository userRepository,
                           GenderRepository genderRepository,
                           AddressRepository addressRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.genderRepository = genderRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder; 
}

    @Override
    public Optional<UserResponseDto> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getEmail(),
                        user.getPassword(),
                        user.getRole(),
                        user.getCreatedAt()
                ));
    }

    @Override
    public Optional<UserProfileResponseDto> findProfileById(Long id) {
        return userRepository.findById(id).map(this::mapToProfile);
    }

    @Override
    public UserRegisDto newUser(UserRegisDto user) {

        if (user.getPassword() == null || user.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        Gender gender = genderRepository.findById(user.getGenderId())
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));

        Address address = addressRepository.findById(user.getAddressId())
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));

        // 🔑 Encriptar contraseña antes de guardar
        String encodedPassword = passwordEncoder.encode(user.getPassword());    

        User newUser = new User();
        newUser.setName(user.getName());
        newUser.setSurname(user.getSurname());
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(encodedPassword);
        newUser.setDni(user.getDni());
        newUser.setPhone(user.getPhone());
        newUser.setBirthDate(user.getBirthDate());
        newUser.setGender(gender);
        newUser.setAddress(address);
        
        if ("admin@seniorcare.com".equalsIgnoreCase(user.getEmail())) {
            newUser.setRole(Role.ADMIN);
        } else {
            newUser.setRole(Role.USER);
        }

        User savedUser = userRepository.save(newUser);

        UserRegisDto dto = new UserRegisDto();
        dto.setName(savedUser.getName());
        dto.setSurname(savedUser.getSurname());
        dto.setUsername(savedUser.getUsername());
        dto.setEmail(savedUser.getEmail());
        dto.setPassword(null);
        dto.setDni(savedUser.getDni());
        dto.setPhone(savedUser.getPhone());
        dto.setBirthDate(savedUser.getBirthDate());
        dto.setGenderId(savedUser.getGender().getId());
        dto.setAddressId(savedUser.getAddress().getId());

        return dto;
    }

    @Override
    public List<UserResponseDto> findAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getEmail(),
                        user.getPassword(),
                        user.getRole(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    private UserProfileResponseDto mapToProfile(User user) {
        UserProfileResponseDto dto = new UserProfileResponseDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setDni(user.getDni());
        dto.setPhone(user.getPhone());
        dto.setBirthDate(user.getBirthDate());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setAddress(mapToAddress(user.getAddress()));
        return dto;
    }

    private AddressResponseDto mapToAddress(Address address) {
        if (address == null) return null;

        Street street = address.getStreet();
        City city = street != null ? street.getCity() : null;
        Country country = city != null ? city.getCountry() : null;

        CountryResponseDto countryDto = null;
        if (country != null) {
            countryDto = new CountryResponseDto();
            countryDto.setId(country.getId());
            countryDto.setName(country.getName());
        }

        CityResponseDto cityDto = null;
        if (city != null) {
            cityDto = new CityResponseDto();
            cityDto.setId(city.getId());
            cityDto.setName(city.getName());
            cityDto.setCountry(countryDto);
        }

        StreetResponseDto streetDto = null;
        if (street != null) {
            streetDto = new StreetResponseDto();
            streetDto.setId(street.getId());
            streetDto.setName(street.getName());
            streetDto.setCity(cityDto);
        }

        AddressResponseDto addressDto = new AddressResponseDto();
        addressDto.setId(address.getId());
        addressDto.setNumber(address.getNumber());
        addressDto.setFloor(address.getFloor());
        addressDto.setApartment(address.getApartment());
        addressDto.setStreet(streetDto);
        return addressDto;
    }
}
