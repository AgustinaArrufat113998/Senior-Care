package com.ps.careRequest_service.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "patient_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "patient_info_diseases",
            joinColumns = @JoinColumn(name = "patient_info_id"),
            inverseJoinColumns = @JoinColumn(name = "disease_id")
    )
    @Default
    private Set<Diseases> diseases = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "patient_info_medications",
            joinColumns = @JoinColumn(name = "patient_info_id"),
            inverseJoinColumns = @JoinColumn(name = "medication_id")
    )
    @Default
    private Set<Medication> medications = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "patient_info_allergies",
            joinColumns = @JoinColumn(name = "patient_info_id"),
            inverseJoinColumns = @JoinColumn(name = "allergy_id")
    )
    @Default
    private Set<Allergy> allergies = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "patient_info_conditions",
            joinColumns = @JoinColumn(name = "patient_info_id"),
            inverseJoinColumns = @JoinColumn(name = "condition_id")
    )
    @Default
    private Set<Condition> patientConditions = new HashSet<>();

    private String additionalInfo;
}

