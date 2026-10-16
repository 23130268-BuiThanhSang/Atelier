package com.atelier.repository;

import com.atelier.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN u.roles r WHERE " +
            "(:role IS NULL OR UPPER(r.name) LIKE CONCAT('%', :role, '%')) AND " +
            "(:status IS NULL OR UPPER(u.status) = :status) AND " +
            "(:keyword IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR (u.phone IS NOT NULL AND LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))))")
    Page<User> findAdminUsers(
            @Param("role") String role,
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("SELECT COUNT(DISTINCT u) FROM User u JOIN u.roles r WHERE UPPER(r.name) LIKE '%PRODUCER%'")
    long countProducers();

    @Query("SELECT COUNT(DISTINCT u) FROM User u JOIN u.roles r WHERE UPPER(r.name) LIKE '%DESIGNER%'")
    long countCustomers();
}