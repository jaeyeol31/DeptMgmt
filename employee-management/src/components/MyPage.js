import React, { useEffect, useState } from 'react';
import EmployeeService from '../services/EmployeeService';

const MyPage = () => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // 세션 스토리지에서 사원번호를 가져옴
    const empno = sessionStorage.getItem('empno');
    
    if (empno) {
      // 사원번호를 통해 사용자 정보를 가져옴
      EmployeeService.getEmployeeById(empno).then((response) => {
        setEmployee(response.data);
      });
    } else {
      console.error('No employee number found in session.');
    }
  }, []);

  if (!employee) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>마이페이지</h2>
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
            <th>부서</th>
            <td>{employee.deptno}</td>
          </tr>
          <tr>
            <th>급여</th>
            <td>{employee.sal}</td>
          </tr>
          {/* 필요한 정보들을 추가로 표시 */}
        </tbody>
      </table>
    </div>
  );
};

export default MyPage;
