package com.ufpa.acc.repository;

import com.ufpa.acc.domain.Curso;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class CursoRepositoryWithBagRelationshipsImpl implements CursoRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Curso> fetchBagRelationships(Optional<Curso> curso) {
        return curso.map(this::fetchTurmas);
    }

    @Override
    public Page<Curso> fetchBagRelationships(Page<Curso> cursos) {
        return new PageImpl<>(fetchBagRelationships(cursos.getContent()), cursos.getPageable(), cursos.getTotalElements());
    }

    @Override
    public List<Curso> fetchBagRelationships(List<Curso> cursos) {
        return Optional.of(cursos).map(this::fetchTurmas).orElse(Collections.emptyList());
    }

    Curso fetchTurmas(Curso result) {
        return entityManager
            .createQuery("select curso from Curso curso left join fetch curso.turmas where curso is :curso", Curso.class)
            .setParameter("curso", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Curso> fetchTurmas(List<Curso> cursos) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, cursos.size()).forEach(index -> order.put(cursos.get(index).getId(), index));
        List<Curso> result = entityManager
            .createQuery("select distinct curso from Curso curso left join fetch curso.turmas where curso in :cursos", Curso.class)
            .setParameter("cursos", cursos)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
