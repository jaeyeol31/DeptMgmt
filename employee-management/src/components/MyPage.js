import React, { useEffect, useState } from 'react';
import EmployeeService from '../services/EmployeeService';

const MyPage = () => {
  const [employee, setEmployee] = useState(null);
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    const empno = sessionStorage.getItem('empno');
    
    if (empno) {
      EmployeeService.getEmployeeById(empno).then((response) => {
        setEmployee(response.data);
        if (response.data.job !== 'MANAGER') {
          EmployeeService.getManagerName(response.data.deptno).then(name => setManagerName(name));
        }
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
          <tr>
            <th>담당 매니저</th>
            <td>{employee.job === 'MANAGER' ? '본인' : managerName}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyPage;
