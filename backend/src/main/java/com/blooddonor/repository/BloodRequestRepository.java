package com.blooddonor.repository;

import com.blooddonor.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Integer> {
    List<BloodRequest> findByUserUserId(Integer userId);
    List<BloodRequest> findTop5ByOrderByRequestDateDesc();
}
