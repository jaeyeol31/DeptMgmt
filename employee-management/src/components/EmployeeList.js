import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    EmployeeService.getAllEmployees().then((response) => {
      setEmployees(response.data);
      setFilteredEmployees(response.data); // 초기 로드 시 모든 직원 표시
    });
  }, []);

  // 검색어 변경 시 필터링 로직
  useEffect(() => {
    const results = employees.filter((employee) =>
      employee.ename.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(results);
  }, [searchTerm, employees]);

  const deleteEmployee = (id) => {
    EmployeeService.deleteEmployee(id).then(() => {
      setEmployees(employees.filter(employee => employee.empno !== id));
      setFilteredEmployees(filteredEmployees.filter(employee => employee.empno !== id)); // 필터링된 목록에서도 제거
    });
  };

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
      <Link to="/add" className="btn btn-primary">직원 추가</Link>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>직업</th>
            <th>부서</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.empno}>
              <td>{employee.empno}</td>
              <td>{employee.ename}</td>
              <td>{employee.job}</td>
              <td>{employee.deptno}</td>
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
