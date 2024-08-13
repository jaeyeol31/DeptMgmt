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
                .orElseThrow(() -> new RuntimeException("Dept not found"));
        return ResponseEntity.ok(dept);
    }

    @GetMapping("/{deptno}/employees")
    public List<Employee> getEmployeesByDept(@PathVariable("deptno") Integer deptno) {
        return employeeService.getEmployeesByDept(deptno);
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
}
