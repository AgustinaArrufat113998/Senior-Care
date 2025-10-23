package com.ps.user_service.User.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ps.user_service.User.Models.Country;

public interface CountryRepository extends JpaRepository<Country, Long> { }
