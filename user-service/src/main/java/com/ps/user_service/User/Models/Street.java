package com.ps.user_service.User.Models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "streets")
@Data
public class Street {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
}
