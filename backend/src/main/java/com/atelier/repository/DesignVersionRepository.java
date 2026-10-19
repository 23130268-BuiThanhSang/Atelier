package com.atelier.repository;

import com.atelier.design.entity.DesignVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesignVersionRepository extends JpaRepository<DesignVersion, Long> {
    List<DesignVersion> findByDesignId(Long designId);
    Optional<DesignVersion> findByDesignIdAndVersionNumber(Long designId, Integer versionNumber);
    Optional<DesignVersion> findTopByDesignIdOrderByVersionNumberDesc(Long designId);
}