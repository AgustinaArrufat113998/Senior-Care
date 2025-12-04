package com.ps.user_service.User.Controller;

import com.ps.user_service.User.Dto.Request.AddressRequestDto;
import com.ps.user_service.User.Dto.Request.CityRequestDto;
import com.ps.user_service.User.Dto.Request.CountryRequestDto;
import com.ps.user_service.User.Dto.Request.StreetRequestDto;
import com.ps.user_service.User.Dto.Response.AddressResponseDto;
import com.ps.user_service.User.Dto.Response.CityResponseDto;
import com.ps.user_service.User.Dto.Response.CountryResponseDto;
import com.ps.user_service.User.Dto.Response.StreetResponseDto;
import com.ps.user_service.User.Service.Interface.IAddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AddressController {

    private final IAddressService addressService;

    public AddressController(IAddressService addressService) {
        this.addressService = addressService;
    }

    // ================== ADDRESS CRUD ==================
    
    @PostMapping
    public ResponseEntity<AddressResponseDto> createAddress(@RequestBody AddressRequestDto dto) {
        AddressResponseDto created = addressService.AddNewAddress(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<AddressResponseDto>> getAllAddresses() {
        List<AddressResponseDto> addresses = addressService.getAllAddresses();
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponseDto> getAddressById(@RequestParam Long id) {
        AddressResponseDto address = addressService.findAddressById(id);
        return ResponseEntity.ok(address);
    }


    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDto> updateAddress(@RequestParam Long id, @RequestBody AddressRequestDto dto) {
        AddressResponseDto updated = addressService.updateAddress(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@RequestParam Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    // ================== AUXILIARY CRUDs ==================

    @PostMapping("/countries")
    public ResponseEntity<CountryResponseDto> createCountry(@RequestBody CountryRequestDto countryDto) {
        CountryResponseDto created = addressService.createCountry(countryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/countries")
    public ResponseEntity<List<CountryResponseDto>> getAllCountries() {
        List<CountryResponseDto> countries = addressService.getAllCountries();
        return ResponseEntity.ok(countries);
    }

    @PostMapping("/cities")
    public ResponseEntity<CityResponseDto> createCity(@RequestBody CityRequestDto cityDto) {
        CityResponseDto created = addressService.createCity(cityDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/countriesId/cities")
    public ResponseEntity<List<CityResponseDto>> getAllCitiesByCountry(@RequestParam(name = "countryId") Long countryId) {
        List<CityResponseDto> cities = addressService.getAllCitiesByCountry(countryId);
        return ResponseEntity.ok(cities);
    }

    @PostMapping("/streets")
    public ResponseEntity<StreetResponseDto> createStreet(@RequestBody StreetRequestDto streetDto) {
        StreetResponseDto created = addressService.createStreet(streetDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/streets")
    public ResponseEntity<List<StreetResponseDto>> getAllStreets() {
        List<StreetResponseDto> streets = addressService.getAllStreets();
        return ResponseEntity.ok(streets);
    }
}
