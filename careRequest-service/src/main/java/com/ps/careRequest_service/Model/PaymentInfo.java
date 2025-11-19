package com.ps.careRequest_service.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;     // Monto total acordado
    private String currency;       // Moneda del pago (por ejemplo, ARS, USD)
    private String method;         // Ej: EFECTIVO, TRANSFERENCIA, TARJETA
    private String status;         // Ej: PENDING, PAID, REFUNDED
    private LocalDateTime paidAt;  // Fecha/hora de confirmación
    private String reference;      // Identificador de la transacción
}
