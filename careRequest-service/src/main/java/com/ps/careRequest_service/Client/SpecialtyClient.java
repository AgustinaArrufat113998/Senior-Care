package com.ps.careRequest_service.Client;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.ps.careRequest_service.Dto.SpecialtySummaryDto;

@Component
public class SpecialtyClient {

    private final WebClient webClient;

    public SpecialtyClient(@Value("${external.specialty-service.url}") String baseUrl,
            WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .build();
    }

    public List<SpecialtySummaryDto> getAllSpecialties() {
        return webClient.get()
                .uri("/all")
                .retrieve()
                .bodyToFlux(SpecialtySummaryDto.class)
                .collectList()
                .block();
    }
}

