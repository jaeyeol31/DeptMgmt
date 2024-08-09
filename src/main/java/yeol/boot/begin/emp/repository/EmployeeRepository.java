package yeol.boot.begin.emp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.emp.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Optional<Employee> findByDeptnoAndJob(int deptno, String job);

}
