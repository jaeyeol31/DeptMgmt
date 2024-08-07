import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

// 직원 상세 정보를 보여주는 컴포넌트
const EmployeeDetail = () => {
  const { id } = useParams(); // URL에서 ID 파라미터를 가져옴
  const [employee, setEmployee] = useState(null); // 직원 정보 상태

  // 직원 ID가 변경될 때마다 해당 직원의 정보를 가져옴
  useEffect(() => {
    EmployeeService.getEmployeeById(id).then((response) => {
      setEmployee(response.data);
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
            <td>{employee.mgr}</td>
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
            <td>{employee.deptno}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetail;
