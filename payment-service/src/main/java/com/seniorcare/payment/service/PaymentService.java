package com.seniorcare.payment.service;

import org.springframework.stereotype.Service;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import com.seniorcare.payment.dto.CreatePaymentRequest;
import com.seniorcare.payment.dto.CreatePaymentResponse;
import java.util.List;

@Service
public class PaymentService {

    public CreatePaymentResponse createPayment(CreatePaymentRequest req) throws Exception {
        // Crear el item de la preferencia
        PreferenceItemRequest item =
                PreferenceItemRequest.builder()
                        .title(req.getTitle())
                        .quantity(req.getQuantity())
                        .unitPrice(req.getPrice())
                        .currencyId("ARS")
                        .build();

        // Crear la preferencia
        PreferenceRequest preferenceRequest =
                PreferenceRequest.builder()
                        .items(List.of(item))
                        .build();

        // Llamar a la API de Mercado Pago
        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        // Retornar respuesta con los datos reales
        return new CreatePaymentResponse(
                preference.getId(),
                "created",
                preference.getInitPoint()
        );
    }
}
