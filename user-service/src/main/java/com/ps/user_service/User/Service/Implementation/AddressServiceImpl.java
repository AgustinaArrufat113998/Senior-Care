package com.ps.user_service.User.Service.Implementation;

import com.ps.user_service.User.Models.Address;
import com.ps.user_service.User.Repository.AddressRepository;
import com.ps.user_service.User.Service.Interface.IAddressService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressServiceImpl implements IAddressService {

    private final AddressRepository addressRepository;

    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    @Override
    public Optional<Address> findById(Long id) {
        return addressRepository.findById(id);
    }

    @Override
    public Address save(Address address) {
        return addressRepository.save(address);
    }

    @Override
    public Address update(Long id, Address address) {
        Address existing = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
        existing.setStreet(address.getStreet());
        existing.setNumber(address.getNumber());
        existing.setCity(address.getCity());
        return addressRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        addressRepository.deleteById(id);
    }
}
