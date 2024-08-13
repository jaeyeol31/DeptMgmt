package yeol.boot.begin.emp.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import yeol.boot.begin.emp.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // 사원번호(empno)로 직원 조회
    Optional<Employee> findByEmpno(Long empno);

    Optional<Employee> findByDeptnoAndRole(int deptno, String role);

    List<Employee> findByDeptno(int deptno);
    
    
}
