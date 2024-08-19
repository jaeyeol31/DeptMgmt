import axios from 'axios';

const DEPT_API_BASE_URL = "http://localhost:8080/api/depts";

class DeptService {

    getAllDepts() {
        return axios.get(DEPT_API_BASE_URL);
    }

    getDeptById(deptno) {
        return axios.get(`${DEPT_API_BASE_URL}/${deptno}`);
    }

    addDept(dept) {
        return axios.post(DEPT_API_BASE_URL, dept);
    }

    updateDept(deptno, dept) {
        return axios.put(`${DEPT_API_BASE_URL}/${deptno}`, dept);
    }

    deleteDept(deptno) {
        return axios.delete(`${DEPT_API_BASE_URL}/${deptno}`);
    }

    // 부서 번호가 존재하는지 확인하는 API 호출
    checkDeptnoExists(deptno) {
        return axios.get(`${DEPT_API_BASE_URL}/checkDeptnoExists`, { params: { deptno } });
    }
}

export default new DeptService();
