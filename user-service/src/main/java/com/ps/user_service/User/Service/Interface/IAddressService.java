package com.ps.user_service.User.Service.Interface;

import com.ps.user_service.User.Models.Address;

import java.util.List;
import java.util.Optional;

public interface IAddressService {
    List<Address> findAll();
    Optional<Address> findById(Long id);
    Address save(Address address);
    Address update(Long id, Address address);
    void delete(Long id);
}
