package yeol.boot.begin.dept.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yeol.boot.begin.dept.entity.Dept;
import yeol.boot.begin.dept.service.DeptService;
import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/depts")
public class DeptController {

    @Autowired
    private DeptService deptService;

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public List<Dept> getAllDepts() {
        return deptService.getAllDepts();
    }

    @GetMapping("/{deptno}")
    public ResponseEntity<Dept> getDeptById(@PathVariable("deptno") Integer deptno) {
        Dept dept = deptService.getDeptById(deptno)
                .orElseThrow(() -> new RuntimeException("부서를 찾을 수 없습니다."));
        return ResponseEntity.ok(dept);
    }

    @GetMapping("/{deptno}/employees")
    public ResponseEntity<List<Employee>> getEmployeesByDept(@PathVariable("deptno") Integer deptno) {
        List<Employee> employees = employeeService.getEmployeesByDept(deptno);
        return ResponseEntity.ok(employees);  // 사원이 없으면 빈 리스트 반환
    }

    @PostMapping
    public Dept addDept(@RequestBody Dept dept) {
        return deptService.addDept(dept);
    }

    @PutMapping("/{deptno}")
    public ResponseEntity<Dept> updateDept(@PathVariable("deptno") Integer deptno, @RequestBody Dept deptDetails) {
        Dept updatedDept = deptService.updateDept(deptno, deptDetails);
        return ResponseEntity.ok(updatedDept);
    }

    @DeleteMapping("/{deptno}")
    public ResponseEntity<Void> deleteDept(@PathVariable("deptno") Integer deptno) {
        deptService.deleteDept(deptno);
        return ResponseEntity.noContent().build();
    }

    // 부서 번호 존재 여부 확인 엔드포인트
    @GetMapping("/checkDeptnoExists")
    public ResponseEntity<Boolean> checkDeptnoExists(@RequestParam("deptno") Integer deptno) {
        boolean exists = deptService.getDeptById(deptno).isPresent();
        return ResponseEntity.ok(exists);
    }
}
