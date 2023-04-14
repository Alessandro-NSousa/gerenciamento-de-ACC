package com.ufpa.acc.repository;

import com.ufpa.acc.domain.Certificado;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Certificado entity.
 */
@Repository
public interface CertificadoRepository extends JpaRepository<Certificado, Long> {
    default Optional<Certificado> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Certificado> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Certificado> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct certificado from Certificado certificado left join fetch certificado.usuario left join fetch certificado.turmaAcc left join fetch certificado.tipoAtividade",
        countQuery = "select count(distinct certificado) from Certificado certificado"
    )
    Page<Certificado> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct certificado from Certificado certificado left join fetch certificado.usuario left join fetch certificado.turmaAcc left join fetch certificado.tipoAtividade"
    )
    List<Certificado> findAllWithToOneRelationships();

    @Query(
        "select certificado from Certificado certificado left join fetch certificado.usuario left join fetch certificado.turmaAcc left join fetch certificado.tipoAtividade where certificado.id =:id"
    )
    Optional<Certificado> findOneWithToOneRelationships(@Param("id") Long id);
}
