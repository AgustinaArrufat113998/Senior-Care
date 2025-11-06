package com.ps.user_service.User.Controller;

import com.ps.user_service.User.Dto.Request.UserRegisDto;
import com.ps.user_service.User.Dto.Response.UserResponseDto;
import com.ps.user_service.User.Service.Interface.IUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserResponseDto> getByEmail(@RequestParam(name = "email") String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserRegisDto> createUser(@RequestBody UserRegisDto userRegisDto) {
        UserRegisDto saved = userService.newUser(userRegisDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
