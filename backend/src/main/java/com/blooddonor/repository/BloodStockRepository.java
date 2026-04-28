package com.blooddonor.repository;

import com.blooddonor.model.BloodStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BloodStockRepository extends JpaRepository<BloodStock, Integer> {
    List<BloodStock> findByBloodBankBankId(Integer bankId);

    Optional<BloodStock> findByBloodBankBankIdAndBloodGroup(Integer bankId, String bloodGroup);

    @Query("SELECT s FROM BloodStock s WHERE s.quantity < :threshold")
    List<BloodStock> findLowStock(@Param("threshold") BigDecimal threshold);
}
