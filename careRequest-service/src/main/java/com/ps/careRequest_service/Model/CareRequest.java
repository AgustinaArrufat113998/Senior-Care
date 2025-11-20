package com.ps.careRequest_service.Model;

import com.ps.careRequest_service.Model.Enum.StatusRequest;
import jakarta.persistence.*;
import lombok.*;
import lombok.Builder.Default;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "care_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Fechas y horarios
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    private String emergencyPhone;
    
    private StatusRequest status; 

    // Preferencias
    private String genderPreference;
    
    @ElementCollection
    @CollectionTable(
            name = "care_request_specialties",
            joinColumns = @JoinColumn(name = "care_request_id"))
    @Column(name = "specialty_id")
    @Default
    private Set<Long> specialtyIds = new LinkedHashSet<>();
    
    // Relaciones
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "carer_id")
    private Long carerId;
    
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "patient_info_id")
    private PatientInfo patientInfo;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "payment_info_id")
    private PaymentInfo paymentInfo;
}
