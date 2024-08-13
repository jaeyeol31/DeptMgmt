package yeol.boot.begin.dept.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yeol.boot.begin.dept.entity.Dept;
import yeol.boot.begin.dept.repository.DeptRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DeptService {

    @Autowired
    private DeptRepository deptRepository;

    public List<Dept> getAllDepts() {
        return deptRepository.findAll();
    }

    public Optional<Dept> getDeptById(Integer deptno) {
        return deptRepository.findById(deptno);
    }

    public Dept addDept(Dept dept) {
        return deptRepository.save(dept);
    }

    public Dept updateDept(Integer deptno, Dept deptDetails) {
        Dept dept = deptRepository.findById(deptno)
                .orElseThrow(() -> new RuntimeException("Dept not found"));
        dept.setDname(deptDetails.getDname());
        dept.setLoc(deptDetails.getLoc());
        return deptRepository.save(dept);
    }

    public void deleteDept(Integer deptno) {
        Dept dept = deptRepository.findById(deptno)
                .orElseThrow(() -> new RuntimeException("Dept not found"));
        deptRepository.delete(dept);
    }
}
