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
        if (deptRepository.existsById(dept.getDeptno())) {
            throw new RuntimeException("이미 존재하는 부서 번호입니다.");
        }
        return deptRepository.save(dept);
    }

    public Dept updateDept(Integer deptno, Dept deptDetails) {
        Dept dept = deptRepository.findById(deptno)
                .orElseThrow(() -> new RuntimeException("해당 부서를 찾을 수 없습니다."));
        dept.setDname(deptDetails.getDname());
        dept.setLoc(deptDetails.getLoc());
        return deptRepository.save(dept);
    }

    public void deleteDept(Integer deptno) {
        Dept dept = deptRepository.findById(deptno)
                .orElseThrow(() -> new RuntimeException("해당 부서를 찾을 수 없습니다."));
        deptRepository.delete(dept);
    }

    // 부서 번호 중복 확인 메서드 추가
    public boolean checkDeptnoExists(Integer deptno) {
        return deptRepository.existsById(deptno);
    }
}
