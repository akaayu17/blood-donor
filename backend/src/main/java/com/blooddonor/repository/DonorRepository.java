package com.blooddonor.repository;

import com.blooddonor.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Integer> {
    Optional<Donor> findByUserUserId(Integer userId);
    boolean existsByUserUserId(Integer userId);
}
