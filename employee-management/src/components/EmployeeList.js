import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';
import { getDepartmentName, departmentMap } from '../constants';

const EmployeeList = () => {
	const [employees, setEmployees] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredEmployees, setFilteredEmployees] = useState([]);

	const [selectedJob, setSelectedJob] = useState(''); // 직업 필터
	const [selectedDept, setSelectedDept] = useState(''); // 부서 필터
	const [sortOrder, setSortOrder] = useState(''); // 입사일 정렬 순서

	const [startDate, setStartDate] = useState(''); // 시작일 필터
	const [endDate, setEndDate] = useState(''); // 종료일 필터

	useEffect(() => {
		EmployeeService.getAllEmployees().then((response) => {
			setEmployees(response.data);
			setFilteredEmployees(response.data); // 초기 로드 시 모든 직원 표시
		});
	}, []);

	useEffect(() => {
		let results = employees;

		if (searchTerm) {
			results = results.filter((employee) =>
				employee.ename.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (selectedJob) {
			results = results.filter((employee) => employee.job === selectedJob);
		}

		if (selectedDept) {
			results = results.filter((employee) => employee.deptno.toString() === selectedDept);
		}

		if (startDate && endDate) {
			results = results.filter((employee) => {
				const hireDate = new Date(employee.hiredate);
				return hireDate >= new Date(startDate) && hireDate <= new Date(endDate);
			});
		}

		if (sortOrder) {
			results = results.sort((a, b) => {
				if (sortOrder === 'latest') {
					return new Date(b.hiredate) - new Date(a.hiredate); // 최신순
				} else if (sortOrder === 'oldest') {
					return new Date(a.hiredate) - new Date(b.hiredate); // 오래된순
				}
				return 0;
			});
		}

		setFilteredEmployees(results);
	}, [searchTerm, selectedJob, selectedDept, sortOrder, startDate, endDate, employees]);

	const deleteEmployee = (id) => {
		EmployeeService.deleteEmployee(id).then(() => {
			setEmployees(employees.filter(employee => employee.empno !== id));
			setFilteredEmployees(filteredEmployees.filter(employee => employee.empno !== id)); // 필터링된 목록에서도 제거
		});
	};

	const uniqueJobs = [...new Set(employees.map((employee) => employee.job))];
	const uniqueDepts = Object.keys(departmentMap);

	return (
		<div>
			<h2>직원 목록</h2>

			<div className="mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="이름으로 검색"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className="row mb-3">
				<div className="col">
					<label>시작일</label>
					<input
						type="date"
						className="form-control"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
				</div>
				<div className="col">
					<label>종료일</label>
					<input
						type="date"
						className="form-control"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
				</div>
			</div>
			<div className="row mb-3">
				<div className="col">
					<select
						className="form-select"
						value={selectedJob}
						onChange={(e) => setSelectedJob(e.target.value)}
					>
						<option value="">직업별 필터</option>
						{uniqueJobs.map((job, index) => (
							<option key={index} value={job}>
								{job}
							</option>
						))}
					</select>
				</div>
				<div className="col">
					<select
						className="form-select"
						value={selectedDept}
						onChange={(e) => setSelectedDept(e.target.value)}
					>
						<option value="">부서별 필터</option>
						{uniqueDepts.map((deptno) => (
							<option key={deptno} value={deptno}>
								{getDepartmentName(parseInt(deptno))}
							</option>
						))}
					</select>
				</div>
				<div className="col">
					<select
						className="form-select"
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value)}
					>
						<option value="">입사일 정렬</option>
						<option value="oldest">최신순</option>
						<option value="latest">오래된순</option>
					</select>
				</div>
			</div>

			<Link to="/add" className="btn btn-primary mb-3">직원 추가</Link>

			<table className="table table-striped mt-3">
				<thead>
					<tr>
						<th>아이디</th>
						<th>이름</th>
						<th>직업</th>
						<th>부서</th>
						<th>입사일</th>
						<th>작업</th>
					</tr>
				</thead>
				<tbody>
					{filteredEmployees.map(employee => (
						<tr key={employee.empno}>
							<td>{employee.empno}</td>
							<td>{employee.ename}</td>
							<td>{employee.job}</td>
							<td>{getDepartmentName(employee.deptno)}</td>
							<td>{employee.hiredate}</td>
							<td>
								<Link to={`/view/${employee.empno}`} className="btn btn-info">보기</Link>
								<Link to={`/edit/${employee.empno}`} className="btn btn-warning">수정</Link>
								<button onClick={() => deleteEmployee(employee.empno)} className="btn btn-danger">삭제</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default EmployeeList;
