package yeol.boot.begin.emp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.emp.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
