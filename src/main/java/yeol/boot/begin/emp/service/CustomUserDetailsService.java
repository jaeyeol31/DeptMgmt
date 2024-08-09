package yeol.boot.begin.emp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import yeol.boot.begin.emp.entity.Employee;
import yeol.boot.begin.emp.repository.EmployeeRepository;
import yeol.boot.begin.emp.security.CustomUserDetails;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String empno) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findById(Long.valueOf(empno))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with empno: " + empno));

        return new CustomUserDetails(employee);
    }
}
