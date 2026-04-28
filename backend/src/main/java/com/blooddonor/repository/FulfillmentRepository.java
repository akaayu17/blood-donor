package com.blooddonor.repository;

import com.blooddonor.model.RequestFulfillment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FulfillmentRepository extends JpaRepository<RequestFulfillment, Integer> {
}
