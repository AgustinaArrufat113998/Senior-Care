package com.ps.careRequest_service.Model;

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

    // Relaciones con usuario y cuidador (solo se guardan los IDs)
    private Long requesterId; // usuario que solicita el cuidado
    private Long carerId;     // cuidador asignado (puede ser null al inicio)

    // Fechas y horarios
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // Preferencias
    private String careType;          // Ej: Cuidador con estudios, Estudiante, etc.
    private String genderPreference;  // Masculino / Femenino / Sin preferencia
    private String careSuggestions;   // Observaciones
    private String emergencyPhone;

    // Estado de la solicitud
    private StatusRequest status; // PENDING, ACCEPTED, REJECTED, COMPLETED

    // Relaciones embebidas
    @Embedded
    private PatientInfo patientInfo;

    @Embedded
    private PaymentInfo paymentInfo;
}