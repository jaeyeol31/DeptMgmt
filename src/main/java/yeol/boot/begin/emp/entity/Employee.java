package yeol.boot.begin.emp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

import java.sql.Date;

@Entity
@Table(name = "emp")
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "empno")
    private Long empno;

    @Column(name = "ename")
    private String ename;

    @Column(name = "job")
    private String job;

    @Column(name = "mgr")
    private Integer mgr;

    @Column(name = "hiredate")
    @Temporal(TemporalType.DATE)
    private Date hiredate;

    @Column(name = "sal")
    private Double sal;

    @Column(name = "comm")
    private Double comm;

    @Column(name = "deptno")
    private Integer deptno;

    @Column(name = "pwd")
    private String pwd;

    @Column(name = "role")
    private String role;
    
    @Column(name = "email")
    private String email;
}
