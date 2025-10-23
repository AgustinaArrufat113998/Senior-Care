package com.ps.user_service.User.Controller;

import com.ps.user_service.User.Models.Address;
import com.ps.user_service.User.Service.Interface.IAddressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final IAddressService addressService;

    public AddressController(IAddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public List<Address> getAll() {
        return addressService.findAll();
    }

    @GetMapping("/{id}")
    public Address getById(@PathVariable Long id) {
        return addressService.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
    }

    @PostMapping
    public Address create(@RequestBody Address address) {
        return addressService.save(address);
    }

    @PutMapping("/{id}")
    public Address update(@PathVariable Long id, @RequestBody Address address) {
        return addressService.update(id, address);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        addressService.delete(id);
    }
}
