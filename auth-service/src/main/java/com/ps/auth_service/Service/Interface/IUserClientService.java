package com.ps.auth_service.Service.Interface;

import com.ps.auth_service.Model.RemoteUserDto;

public interface IUserClientService {
    RemoteUserDto getByEmail(String email);
}
