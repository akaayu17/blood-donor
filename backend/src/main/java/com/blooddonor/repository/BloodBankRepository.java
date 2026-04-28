package com.blooddonor.repository;

import com.blooddonor.model.BloodBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BloodBankRepository extends JpaRepository<BloodBank, Integer> {
    Optional<BloodBank> findByLicenseNumber(String licenseNumber);
    boolean existsByLicenseNumber(String licenseNumber);
}
