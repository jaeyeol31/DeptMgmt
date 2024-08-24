package yeol.boot.begin.emp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.repository.EmployeeRepository;

@Service
public class EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepository;

	public List<Employee> getAllEmployees() {
		return employeeRepository.findAll();
	}

	public Optional<Employee> getEmployeeById(Long id) {
		return employeeRepository.findById(id);
	}

	// 사원번호(empno)로 직원 조회
	public Optional<Employee> getEmployeeByEmpno(Long empno) {
		return employeeRepository.findByEmpno(empno);
	}

	public Employee addEmployee(Employee employee) {
		Employee savedEmployee = employeeRepository.save(employee);
		updateMgrForDepartment(savedEmployee.getDeptno());
		return savedEmployee;
	}

	public Employee updateEmployee(Long id, Employee employeeDetails) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Employee not found"));

		employee.setEname(employeeDetails.getEname());
		employee.setJob(employeeDetails.getJob());
		employee.setMgr(employeeDetails.getMgr());
		employee.setHiredate(employeeDetails.getHiredate());
		employee.setSal(employeeDetails.getSal());
		employee.setComm(employeeDetails.getComm());
		employee.setDeptno(employeeDetails.getDeptno());
		employee.setEmail(employeeDetails.getEmail());
		employee.setPwd(employeeDetails.getPwd());
		employee.setRole(employeeDetails.getRole());
		employee.setPhone(employeeDetails.getPhone());
		employee.setAddress(employeeDetails.getAddress());

		Employee updatedEmployee = employeeRepository.save(employee);
		updateMgrForDepartment(updatedEmployee.getDeptno());
		return updatedEmployee;
	}

	public void deleteEmployee(Long id) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Employee not found"));
		employeeRepository.delete(employee);
		updateMgrForDepartment(employee.getDeptno());
	}

	public Optional<Employee> getManagerByDeptNo(int deptNo) {
		return employeeRepository.findByDeptnoAndRole(deptNo, "Department Manager");
	}

	private void updateMgrForDepartment(int deptNo) {
		Optional<Employee> managerOpt = getManagerByDeptNo(deptNo);
		managerOpt.ifPresent(manager -> {
			List<Employee> employees = employeeRepository.findByDeptno(deptNo);
			for (Employee emp : employees) {
				if (!emp.getRole().equals("Department Manager")) {
					emp.setMgr(manager.getEmpno().intValue()); // empno를 Integer로 변환하여 설정
					employeeRepository.save(emp);
				}
			}
		});
	}

	// 비밀번호 변경 로직 추가
	public boolean changePassword(Long empno, String currentPassword, String newPassword) {
		Optional<Employee> employeeOpt = getEmployeeByEmpno(empno);

		if (employeeOpt.isPresent()) {
			Employee employee = employeeOpt.get();

			if (employee.getPwd().equals(currentPassword)) {
				employee.setPwd(newPassword);
				employeeRepository.save(employee);
				return true;
			}
		}

		return false;
	}

	public List<Employee> getEmployeesByDept(int deptno) {
		return employeeRepository.findByDeptno(deptno);
	}
	
	public List<Employee> searchEmployeesByName(String name) {
        return employeeRepository.findByEnameContainingIgnoreCase(name);
    }
}