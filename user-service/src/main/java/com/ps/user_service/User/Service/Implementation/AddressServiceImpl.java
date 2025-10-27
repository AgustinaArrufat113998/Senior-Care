package com.ps.user_service.User.Service.Implementation;

import com.ps.user_service.User.Dto.Request.AddressRequestDto;
import com.ps.user_service.User.Dto.Request.CityRequestDto;
import com.ps.user_service.User.Dto.Request.CountryRequestDto;
import com.ps.user_service.User.Dto.Request.StreetRequestDto;
import com.ps.user_service.User.Dto.Response.*;
import com.ps.user_service.User.Models.*;
import com.ps.user_service.User.Repository.*;
import com.ps.user_service.User.Service.Interface.IAddressService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements IAddressService {

    private final AddressRepository addressRepository;
    private final StreetRepository streetRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    public AddressServiceImpl(AddressRepository addressRepository,
                          StreetRepository streetRepository,
                          CityRepository cityRepository,
                          CountryRepository countryRepository) {

        this.addressRepository = addressRepository;
        this.streetRepository = streetRepository;
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
    }

    // ================== ADDRESS CRUD ==================

    public List<AddressResponseDto> getAllAddresses() {
        return addressRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AddressResponseDto findAddressById(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        return mapToResponse(address);
    }

    public AddressResponseDto AddNewAddress(AddressRequestDto dto) {
        Street street = streetRepository.findById(dto.getStreetId())
                .orElseThrow(() -> new RuntimeException("Street not found"));

        Address address = new Address();
        address.setNumber(dto.getNumber());
        address.setFloor(dto.getFloor());
        address.setApartment(dto.getApartment());
        address.setStreet(street);

        Address saved = addressRepository.save(address);
        return mapToResponse(saved);
    }

    public AddressResponseDto updateAddress(Long id, AddressRequestDto dto) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Street street = streetRepository.findById(dto.getStreetId())
                .orElseThrow(() -> new RuntimeException("Street not found"));

        address.setNumber(dto.getNumber());
        address.setFloor(dto.getFloor());
        address.setApartment(dto.getApartment());
        address.setStreet(street);

        return mapToResponse(addressRepository.save(address));
    }

    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }

    // ================== AUX CRUDs ==================

    public CountryResponseDto createCountry(CountryRequestDto countryDto) {
        Country country = new Country();
        country.setName(countryDto.getName());
        Country savedCountry = countryRepository.save(country);

        CountryResponseDto countryResponseDto = new CountryResponseDto();
        countryResponseDto.setId(savedCountry.getId());
        countryResponseDto.setName(savedCountry.getName());

        return countryResponseDto;
    }

    public CityResponseDto createCity(CityRequestDto cityDto) {
        Country country = countryRepository.findById(cityDto.getCountryId())
                .orElseThrow(() -> new RuntimeException("Country not found"));
        City city = new City();
        city.setName(cityDto.getName());
        city.setCountry(country);
        City savedCity = cityRepository.save(city);

        CountryResponseDto countryResponseDto = new CountryResponseDto();
        countryResponseDto.setId(country.getId());
        countryResponseDto.setName(country.getName());

        CityResponseDto cityResponseDto = new CityResponseDto();
        cityResponseDto.setId(savedCity.getId());
        cityResponseDto.setName(savedCity.getName());
        cityResponseDto.setCountry(countryResponseDto);

        return cityResponseDto;
    }

    public StreetResponseDto createStreet(StreetRequestDto streetDto) {
        City city = cityRepository.findById(streetDto.getCityId())
                .orElseThrow(() -> new RuntimeException("City not found"));
        Street street = new Street();
        street.setName(streetDto.getName());
        street.setCity(city);
        Street savedStreet = streetRepository.save(street);

        CityResponseDto cityResponseDto = new CityResponseDto();
        cityResponseDto.setId(city.getId());
        cityResponseDto.setName(city.getName());
        
        StreetResponseDto streetResponseDto = new StreetResponseDto();
        streetResponseDto.setId(savedStreet.getId());
        streetResponseDto.setName(savedStreet.getName());
        streetResponseDto.setCity(cityResponseDto);

        return streetResponseDto;
    }

    // ================== MAPPER ==================

    public AddressResponseDto mapToResponse(Address address) {
        Country country = address.getStreet().getCity().getCountry();
        City city = address.getStreet().getCity();
        Street street = address.getStreet();

        CountryResponseDto countryDto = new CountryResponseDto();
        countryDto.setId(country.getId());
        countryDto.setName(country.getName());

        CityResponseDto cityDto = new CityResponseDto();
        cityDto.setId(city.getId());
        cityDto.setName(city.getName());
        cityDto.setCountry(countryDto);

        StreetResponseDto streetDto = new StreetResponseDto();
        streetDto.setId(street.getId());
        streetDto.setName(street.getName());
        streetDto.setCity(cityDto);

        AddressResponseDto addressDto = new AddressResponseDto();
        addressDto.setId(address.getId());
        addressDto.setNumber(address.getNumber());
        addressDto.setFloor(address.getFloor());
        addressDto.setApartment(address.getApartment());
        addressDto.setStreet(streetDto);

        return addressDto;
    }
}
