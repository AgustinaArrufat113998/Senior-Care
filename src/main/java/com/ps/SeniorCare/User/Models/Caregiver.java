package com.ps.SeniorCare.User.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "caregivers")
@Data
@EqualsAndHashCode(callSuper = true)
public class Caregiver extends User {

    @Column(nullable = false)
    private String studies; 

    @Column(nullable = false)
    private String experience; 
    
    @Column(nullable = false)
    private String availability; 

    @Column(nullable = false)
    private Double rate; 

    @Column(nullable = true)
    private String secondaryContact; 
}
