import axios from 'axios';

const EMPLOYEE_API_BASE_URL = "http://localhost:8080/api/employees"; // Spring Boot 서버 포트 8080 사용

class EmployeeService {
	getAllEmployees() {
		return axios.get(EMPLOYEE_API_BASE_URL);
	}

	getEmployeeById(id) {
		return axios.get(`${EMPLOYEE_API_BASE_URL}/${id}`);
	}

	addEmployee(employee) {
		return axios.post(EMPLOYEE_API_BASE_URL, employee);
	}

	updateEmployee(id, employee) {
		return axios.put(`${EMPLOYEE_API_BASE_URL}/${id}`, employee);
	}

	deleteEmployee(id) {
		return axios.delete(`${EMPLOYEE_API_BASE_URL}/${id}`);
	}

	getManagerByDept(deptno) {
		return axios.get(`${EMPLOYEE_API_BASE_URL}/manager`, { params: { deptno } })
			.then(response => response.data);
	}

	changePassword(changePasswordRequest) {
		return axios.post(`${EMPLOYEE_API_BASE_URL}/change-password`, changePasswordRequest);
	}
}

export default new EmployeeService();
