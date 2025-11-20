package com.ps.careRequest_service.Client;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.ps.careRequest_service.Dto.SpecialtyDto;

@Component
public class SpecialtyClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(SpecialtyClient.class);

    private final WebClient webClient;
    private final String specialtiesUrl;

    public SpecialtyClient(WebClient.Builder webClientBuilder,
            @Value("${external.user-service.specialties-url}") String specialtiesUrl) {
        this.webClient = webClientBuilder.build();
        this.specialtiesUrl = specialtiesUrl;
    }

    public List<SpecialtyDto> getAllSpecialties() {
        try {
            return webClient.get()
                    .uri(specialtiesUrl)
                    .retrieve()
                    .bodyToFlux(SpecialtyDto.class)
                    .collectList()
                    .block();
        } catch (Exception ex) {
            LOGGER.error("Failed to retrieve specialties from user-service", ex);
            return Collections.emptyList();
        }
    }
}
