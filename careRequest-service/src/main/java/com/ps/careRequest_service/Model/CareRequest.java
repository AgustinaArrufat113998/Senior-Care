package com.ps.careRequest_service.Model;

import com.ps.careRequest_service.Model.Enum.StatusRequest;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

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

    private Long requesterId;
    private Long carerId;

    // Fechas y horarios
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    // Preferencias
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "care_type_id")
    private CareType careType;
    private String genderPreference; 
    private String emergencyPhone;
    
    private StatusRequest status; 
    

    // Relaciones
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "patient_info_id")
    private PatientInfo patientInfo;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "payment_info_id")
    private PaymentInfo paymentInfo;
}
