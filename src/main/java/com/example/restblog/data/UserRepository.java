package com.example.restblog.data;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByEmailContains(String email);
    List<User> findAllByEmail(String email);
    List<User> findAllByEmailContainsAndEmail(String email, String auth);

    Boolean existsByEmail(String email);
}