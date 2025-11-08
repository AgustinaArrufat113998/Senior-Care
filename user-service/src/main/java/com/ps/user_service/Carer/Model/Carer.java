package com.ps.user_service.Carer.Model;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import com.ps.user_service.User.Models.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "carers")
@Getter
@Setter
@NoArgsConstructor
public class Carer extends User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String experience;
    
    @Column(length = 500)
    private String availability;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    // === Relationships ===
    @ManyToOne
    @JoinColumn(name = "specialty_id")
    private Specialty specialty;

    @ManyToMany
    @JoinTable(
            name = "carer_skill",
            joinColumns = @JoinColumn(name = "carer_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();
}
