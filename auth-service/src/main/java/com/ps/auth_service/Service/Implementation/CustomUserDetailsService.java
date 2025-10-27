// package com.ps.auth_service.Service.Implementation;


// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.core.userdetails.User.UserBuilder;
// import org.springframework.stereotype.Service;

// @Service
// public class CustomUserDetailsService implements UserDetailsService {

//     private final UserRepository userRepository;

//     public CustomUserDetailsService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     @Override
//     public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//         User user = userRepository.findByEmail(email)
//                 .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

//         UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(user.getEmail());
//         builder.password(user.getPassword());
//         builder.roles(user.getRole()); // asegúrate que getRole() devuelva algo como "USER" o "ADMIN"

//         return builder.build();
//     }
// }
