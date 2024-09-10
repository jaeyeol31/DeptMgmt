package yeol.boot.begin.emp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import yeol.boot.begin.emp.dto.ChangePasswordRequest;
import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.service.EmployeeService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	@GetMapping
	public List<Employee> getAllEmployees() {
		return employeeService.getAllEmployees();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable("id") Long id) {
		Employee employee = employeeService.getEmployeeById(id)
				.orElseThrow(() -> new RuntimeException("Employee not found"));
		return ResponseEntity.ok(employee);
	}

	@PostMapping
	public Employee addEmployee(@RequestBody Employee employee) {
		return employeeService.addEmployee(employee);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Employee> updateEmployee(@PathVariable("id") Long id, @RequestBody Employee employeeDetails) {
		Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
		return ResponseEntity.ok(updatedEmployee);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteEmployee(@PathVariable("id") Long id) {
		employeeService.deleteEmployee(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("manager")
    public ResponseEntity<Employee> getManagerByDeptNo(@RequestParam("deptno") int deptNo) {
        Optional<Employee> managerOpt = employeeService.getManagerByDeptNo(deptNo);
        if (managerOpt.isPresent()) {
            return ResponseEntity.ok(managerOpt.get());
        } else {
            return ResponseEntity.status(404).body(null); // 매니저를 찾지 못한 경우
        }
    }

	@PostMapping("/change-password")
	public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest,
			HttpSession session) {
		boolean success = employeeService.changePassword(changePasswordRequest.getEmpno(),
				changePasswordRequest.getCurrentPassword(), changePasswordRequest.getNewPassword());

		if (success) {
			// 세션 무효화 (로그아웃)
			session.invalidate();
			return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다. 로그아웃되었습니다.");
		} else {
			return ResponseEntity.status(401).body("현재 비밀번호가 일치하지 않습니다.");
		}
	}

	@GetMapping("/department/{deptno}")
	public ResponseEntity<List<Employee>> getEmployeesByDept(@PathVariable("deptno") int deptNo) {
		List<Employee> employees = employeeService.getEmployeesByDept(deptNo);
		return ResponseEntity.ok(employees);
	}
	
	 @GetMapping("/search")
	    public ResponseEntity<List<Employee>> searchEmployeesByName(@RequestParam("name") String name) {
	        List<Employee> employees = employeeService.searchEmployeesByName(name);
	        return ResponseEntity.ok(employees);
	    }
}
