import axios from 'axios';

const DEPT_API_BASE_URL = "http://localhost:8080/api/depts"; // 서버의 실제 엔드포인트로 업데이트

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
}

export default new DeptService();
