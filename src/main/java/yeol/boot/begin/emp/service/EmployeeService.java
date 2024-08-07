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

    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setEname(employeeDetails.getEname());
        employee.setJob(employeeDetails.getJob());
        employee.setMgr(employeeDetails.getMgr());
        employee.setHiredate(employeeDetails.getHiredate());
        employee.setSal(employeeDetails.getSal());
        employee.setComm(employeeDetails.getComm());
        employee.setDeptno(employeeDetails.getDeptno());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        employeeRepository.delete(employee);
    }
}
