package com.ufpa.acc.repository;

import com.ufpa.acc.domain.TurmaACC;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TurmaACC entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TurmaACCRepository extends JpaRepository<TurmaACC, Long> {}
