package com.ps.careRequest_service.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/status")
public class StatusController {
    @GetMapping("/health")
    public String healthCheck() {
        return "Care Request Service is up and running!";
    }
}
