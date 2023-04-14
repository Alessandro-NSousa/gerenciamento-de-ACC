package com.ufpa.acc.repository;

import com.ufpa.acc.domain.Curso;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface CursoRepositoryWithBagRelationships {
    Optional<Curso> fetchBagRelationships(Optional<Curso> curso);

    List<Curso> fetchBagRelationships(List<Curso> cursos);

    Page<Curso> fetchBagRelationships(Page<Curso> cursos);
}
