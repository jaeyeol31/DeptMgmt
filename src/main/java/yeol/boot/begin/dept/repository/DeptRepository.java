package yeol.boot.begin.dept.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.dept.entity.Dept;

public interface DeptRepository extends JpaRepository<Dept, Integer> {
}
