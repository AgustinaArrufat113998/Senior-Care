package com.ps.SeniorCare.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ps.SeniorCare.Dto.UserDto.UserRegisDto;
import com.ps.SeniorCare.Dto.UserDto.UserResponseDto;
import com.ps.SeniorCare.Service.Interface.IUserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegisDto> registerUser(@RequestBody UserRegisDto userDto) {
        return ResponseEntity.ok(userService.newUser(userDto));
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserResponseDto> getUserByEmail(String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
