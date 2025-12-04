package com.ps.user_service.User.Service.Interface;

import com.ps.user_service.User.Dto.Request.AddressRequestDto;
import com.ps.user_service.User.Dto.Request.CityRequestDto;
import com.ps.user_service.User.Dto.Request.CountryRequestDto;
import com.ps.user_service.User.Dto.Request.StreetRequestDto;
import com.ps.user_service.User.Dto.Response.AddressResponseDto;
import com.ps.user_service.User.Dto.Response.CityResponseDto;
import com.ps.user_service.User.Dto.Response.CountryResponseDto;
import com.ps.user_service.User.Dto.Response.StreetResponseDto;
import com.ps.user_service.User.Models.Address;

import java.util.List;

public interface IAddressService {

    // ================== ADDRESS CRUD ==================
    List<AddressResponseDto> getAllAddresses();
    AddressResponseDto findAddressById(Long id);
    AddressResponseDto AddNewAddress(AddressRequestDto address);
    AddressResponseDto updateAddress(Long id, AddressRequestDto address);
    void deleteAddress(Long id);

    // ================== AUX CRUDs ==================
    CountryResponseDto createCountry(CountryRequestDto countryDto);
    CityResponseDto createCity(CityRequestDto cityDto);
    StreetResponseDto createStreet(StreetRequestDto streetDto);
    List<CountryResponseDto> getAllCountries();
    List<CityResponseDto> getAllCitiesByCountry(Long countryId);
    List<StreetResponseDto> getAllStreets();

    // ================== MAPPER ==================
    AddressResponseDto mapToResponse(Address address);
}
