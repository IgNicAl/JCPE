package br.com.jcpm.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.model.CadUser;

@Repository
public interface CadUserRepository extends JpaRepository<CadUser, Long> {
    Optional<CadUser> findByEmail(String email);
}
