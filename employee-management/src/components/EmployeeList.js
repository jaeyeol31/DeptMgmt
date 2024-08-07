import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    EmployeeService.getAllEmployees().then((response) => {
      setEmployees(response.data);
    });
  }, []);

  const deleteEmployee = (id) => {
    EmployeeService.deleteEmployee(id).then(() => {
      setEmployees(employees.filter(employee => employee.empno !== id));
    });
  };

  return (
    <div>
      <h2>직원 목록</h2>
      <Link to="/add" className="btn btn-primary">직원 추가</Link>
      <table className="table table-striped">
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
          {employees.map(employee => (
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
