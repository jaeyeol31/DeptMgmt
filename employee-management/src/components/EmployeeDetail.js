import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';
import { getDepartmentName } from '../constants';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    EmployeeService.getEmployeeById(id).then((response) => {
      setEmployee(response.data);
      EmployeeService.getManagerName(response.data.deptno).then(name => setManagerName(name));
    });
  }, [id]);

  if (!employee) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>직원 상세 정보</h2>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>아이디</th>
            <td>{employee.empno}</td>
          </tr>
          <tr>
            <th>이름</th>
            <td>{employee.ename}</td>
          </tr>
          <tr>
            <th>직업</th>
            <td>{employee.job}</td>
          </tr>
          <tr>
            <th>담당 매니저</th>
            <td>{managerName}</td>
          </tr>
          <tr>
            <th>입사일</th>
            <td>{employee.hiredate}</td>
          </tr>
          <tr>
            <th>급여</th>
            <td>{employee.sal}</td>
          </tr>
          <tr>
            <th>커미션</th>
            <td>{employee.comm}</td>
          </tr>
          <tr>
            <th>부서</th>
            <td>{getDepartmentName(employee.deptno)}</td>
          </tr>
          <tr>
            <th>권한</th>
            <td>{employee.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetail;
