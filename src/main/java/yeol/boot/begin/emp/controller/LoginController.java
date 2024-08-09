package yeol.boot.begin.emp.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.service.EmployeeService;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private EmployeeService employeeService;
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Optional<Employee> employeeOpt = employeeService.getEmployeeByEmpno(loginRequest.getEmpno());

        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();

            if (employee.getPwd().equals(loginRequest.getPassword())) {
                // 로그인 성공 시 세션에 사용자 정보 저장
                session.setAttribute("employee", employee);
                session.setAttribute("empno", employee.getEmpno()); // 사원번호 저장
                return ResponseEntity.ok("로그인 성공");
            }
        }

        // 로그인 실패 시
        return ResponseEntity.status(401).body("아이디 또는 비밀번호가 일치하지 않습니다.");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();  // 세션 무효화
        return ResponseEntity.noContent().build();
    }
}


class LoginRequest {
    private Long empno;
    private String password;

    // getters and setters
    public Long getEmpno() {
        return empno;
    }

    public void setEmpno(Long empno) {
        this.empno = empno;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
