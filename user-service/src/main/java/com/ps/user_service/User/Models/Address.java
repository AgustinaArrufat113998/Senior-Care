package com.ps.user_service.User.Models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "addresses")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String number;

    @Column
    private String floor;

    @Column
    private String apartment;

    @ManyToOne
    @JoinColumn(name = "street_id", nullable = false)
    private Street street;
}
