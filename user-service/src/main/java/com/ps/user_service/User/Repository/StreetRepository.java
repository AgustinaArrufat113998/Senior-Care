package com.ps.user_service.User.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ps.user_service.User.Models.Street;

public interface StreetRepository extends JpaRepository<Street, Long> { }
