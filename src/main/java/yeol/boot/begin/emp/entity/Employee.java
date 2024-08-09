package yeol.boot.begin.emp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "emp")
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empno;
    private String ename;
    private String job;
    private Integer mgr;
    private String hiredate;
    private Double sal;
    private Double comm;
    private Integer deptno;
    private String pwd;
    private String role;
}
