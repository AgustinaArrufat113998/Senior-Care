package com.seniorcare.payment.dto;
import lombok.Data;

@Data
public class CreatePaymentRequest {
    private String title;
    private String description;
    private Double amount;
    private String currency;
    private String payerEmail;
    private String externalReference;
}
