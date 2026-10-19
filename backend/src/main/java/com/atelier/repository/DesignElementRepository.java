package com.atelier.repository;

import com.atelier.design.entity.DesignElement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignElementRepository extends JpaRepository<DesignElement, Long> {
    List<DesignElement> findByDesignVersionId(Long designVersionId);
    List<DesignElement> findByDesignVersionIdOrderByIdAsc(Long designVersionId);
}