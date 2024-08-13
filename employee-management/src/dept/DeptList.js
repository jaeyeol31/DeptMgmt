import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeptService from '../services/DeptService';

const DeptList = () => {
  const [depts, setDepts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    DeptService.getAllDepts().then((response) => {
      setDepts(response.data);
    });
  }, []);

  const deleteDept = (deptno) => {
    DeptService.deleteDept(deptno).then(() => {
      setDepts(depts.filter(dept => dept.deptno !== deptno));
    });
  };

  return (
    <div>
      <h2>부서 목록</h2>
      <Link to="/departments/add" className="btn btn-primary mb-3">부서 추가</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>부서 번호</th>
            <th>부서 이름</th>
            <th>위치</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {depts.map(dept => (
            <tr key={dept.deptno}>
              <td>{dept.deptno}</td>
              <td>{dept.dname}</td>
              <td>{dept.loc}</td>
              <td>
                <Link to={`/departments/detail/${dept.deptno}`} className="btn btn-info">보기</Link>
                <Link to={`/departments/edit/${dept.deptno}`} className="btn btn-warning ms-2">수정</Link>
                <button onClick={() => deleteDept(dept.deptno)} className="btn btn-danger ms-2">삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeptList;
