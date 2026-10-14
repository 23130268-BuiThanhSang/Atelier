package com.atelier.repository;

import com.atelier.production.entity.ProducerProfile;
import com.atelier.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProducerProfileRepository extends JpaRepository<ProducerProfile, Long> {

    // Spring Data JPA sẽ TỰ ĐỘNG viết câu lệnh SELECT * FROM producer_profile WHERE user_id = ?
    Optional<ProducerProfile> findByUser(User user);

}