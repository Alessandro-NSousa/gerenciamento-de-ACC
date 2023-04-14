package com.ufpa.acc.repository;

import com.ufpa.acc.domain.TipoAtividade;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TipoAtividade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipoAtividadeRepository extends JpaRepository<TipoAtividade, Long> {}
