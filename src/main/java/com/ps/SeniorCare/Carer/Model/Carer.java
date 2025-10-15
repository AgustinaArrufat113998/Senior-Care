package com.ps.SeniorCare.Carer.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "carers")
@Data
public class Carer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String surname;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String dni;
    
    @Column(nullable = false)
    private String gender;
    
    @Column(nullable = false)
    private String birthDate;
    
    @Column(nullable = false)
    private String specialty;
    
    @Column(nullable = false)
    private String experience;
    
    @Column(nullable = true)
    private Boolean available;
}
