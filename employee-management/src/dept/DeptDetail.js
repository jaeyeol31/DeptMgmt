import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DeptService from '../services/DeptService';
import EmployeeService from '../services/EmployeeService';

const DeptDetail = () => {
  const { deptno } = useParams();
  const [dept, setDept] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [manager, setManager] = useState(null);

  useEffect(() => {
    if (deptno) {
      // 부서 정보를 가져옴
      DeptService.getDeptById(deptno).then((response) => {
        setDept(response.data);
      });

      // 부서의 사원 목록을 가져옴
      EmployeeService.getEmployeesByDept(deptno).then((response) => {
        setEmployees(response.data);
      });

      // 부서의 매니저 정보를 가져옴
      EmployeeService.getManagerByDept(deptno).then((response) => {
        setManager(response);
      });
    }
  }, [deptno]);

  if (!dept) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>부서 상세 정보</h2>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>부서 번호</th>
            <td>{dept.deptno}</td>
          </tr>
          <tr>
            <th>부서 이름</th>
            <td>{dept.dname}</td>
          </tr>
          <tr>
            <th>위치</th>
            <td>{dept.loc}</td>
          </tr>
          <tr>
            <th>매니저</th>
            <td>{manager ? manager.ename : '매니저 없음'}</td>
          </tr>
        </tbody>
      </table>

      <h3>소속 사원 목록</h3>
      {employees.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>사원 번호</th>
              <th>이름</th>
              <th>직급</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>상세보기</th> {/* 사원 상세보기 버튼 추가 */}
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.empno}>
                <td>{employee.empno}</td>
                <td>{employee.ename}</td>
                <td>{employee.job}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>
                  <Link to={`/view/${employee.empno}`} className="btn btn-info">상세보기</Link>
                </td> {/* 상세보기 버튼 */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>이 부서에 소속된 사원이 없습니다.</p>
      )}

      <Link to="/departments" className="btn btn-primary">목록으로 돌아가기</Link>
      <Link to={`/departments/edit/${dept.deptno}`} className="btn btn-warning ms-2">수정</Link>
    </div>
  );
};

export default DeptDetail;
