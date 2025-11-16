package com.seniorcare.payment.controller;

import com.seniorcare.payment.dto.CreatePaymentRequest;
import com.seniorcare.payment.dto.CreatePaymentResponse;
import com.seniorcare.payment.service.PaymentService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {
    
    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/preference")
    public ResponseEntity<CreatePaymentResponse> create(@RequestBody CreatePaymentRequest req) throws Exception {
        return ResponseEntity.ok(service.createPayment(req));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestBody String payload) {
        // En el futuro podés manejar confirmaciones acá
        return ResponseEntity.ok().build();
    }
}
