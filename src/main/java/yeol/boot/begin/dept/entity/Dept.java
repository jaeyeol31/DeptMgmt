package yeol.boot.begin.dept.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;

@Entity
@Table(name = "dept")
@Data
public class Dept {

    @Id
    @Column(name = "deptno")
    private Integer deptno; 

    @Column(name = "dname")
    private String dname;

    @Column(name = "loc")
    private String loc;
}
