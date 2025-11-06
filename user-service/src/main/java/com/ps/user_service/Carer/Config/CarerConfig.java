package com.ps.user_service.Carer.Config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;

public class CarerConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
