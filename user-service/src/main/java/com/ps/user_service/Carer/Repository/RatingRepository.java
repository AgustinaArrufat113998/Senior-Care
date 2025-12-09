package com.ps.user_service.Carer.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ps.user_service.Carer.Model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByCarer_Id(Long carerId);

    long countByCarer_Id(Long carerId);

    @Query("SELECT COALESCE(AVG(r.score), 0) FROM Rating r WHERE r.carer.id = :carerId")
    Double findAverageScoreByCarerId(@Param("carerId") Long carerId);
}
