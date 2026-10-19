package com.atelier.repository;

import com.atelier.design.entity.Design;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignRepository extends JpaRepository<Design, Long> {
    List<Design> findByUserIdOrderByUpdatedAtDesc(Long userId);
    List<Design> findByUserIdOrderByIdDesc(Long userId);
    List<Design> findAllByOrderByIdDesc();
    List<Design> findByVisibilityIgnoreCaseOrderByIdDesc(String visibility);
}