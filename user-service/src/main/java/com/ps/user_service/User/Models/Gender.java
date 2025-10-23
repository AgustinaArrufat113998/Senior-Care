package com.ps.user_service.User.Models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "genders")
@Data
public class Gender {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String description;
}
