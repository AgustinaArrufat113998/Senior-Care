package com.ps.auth_service.Service.Implementation;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.ps.auth_service.Model.RemoteUserDto;
import com.ps.auth_service.Service.Interface.IUserClientService;

@Service
public class UserClientServiceImpl implements IUserClientService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${user.service.url}")
    private String userServiceUrl;

    @Value("${user.service.findByEmail}")
    private String findByEmailPath;

    public RemoteUserDto getByEmail(String email) {
        try {
            String url = userServiceUrl + findByEmailPath + email;
            return restTemplate.getForObject(url, RemoteUserDto.class);
        } catch (RestClientException e) {
            return null; // trataremos como no encontrado / error remoto
        }
    }
    
}
