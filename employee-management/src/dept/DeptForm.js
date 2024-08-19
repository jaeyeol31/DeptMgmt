import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeptService from '../services/DeptService';

const DeptForm = () => {
  const { id: deptno } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState({
    deptno: '',
    dname: '',
    loc: ''
  });
  const [isDeptnoValid, setIsDeptnoValid] = useState(true); // 부서 번호 유효성 상태
  const [isChecked, setIsChecked] = useState(false); // 중복 확인 여부

  useEffect(() => {
    if (deptno) {
      DeptService.getDeptById(deptno).then((response) => {
        setDept(response.data);
        setIsChecked(true); // 기존 부서 수정 시 중복 확인 상태를 true로 설정
      });
    }
  }, [deptno]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDept(prevState => ({
      ...prevState,
      [name]: value
    }));
    setIsChecked(false); // 부서 번호 변경 시 중복 확인 상태를 초기화
  };

  const handleCheckDeptno = async () => {
    if (dept.deptno.trim() === '') {
      alert('부서 번호를 입력하세요.');
      return;
    }

    try {
      const response = await DeptService.checkDeptnoExists(dept.deptno);
      if (response.data) {
        alert('해당 부서 번호는 이미 존재합니다. 다른 번호를 입력하세요.');
        setIsDeptnoValid(false);
        setDept(prevState => ({
          ...prevState,
          deptno: ''
        }));
      } else {
        alert('사용 가능한 부서 번호입니다.');
        setIsDeptnoValid(true);
      }
      setIsChecked(true); // 중복 확인 상태 설정
    } catch (error) {
      console.error("Error checking deptno:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isChecked) {
      alert('부서 번호 중복 확인을 해주세요.');
      return;
    }
    if (deptno) {
      DeptService.updateDept(deptno, dept).then(() => {
        navigate('/departments');
      });
    } else {
      DeptService.addDept(dept).then(() => {
        navigate('/departments');
      });
    }
  };

  return (
    <div>
      <h2>{deptno ? '부서 수정' : '부서 추가'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>부서 번호</label>
          <div className="d-flex">
            <input
              type="number"
              name="deptno"
              value={dept.deptno}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="부서 번호를 입력하세요 (10 단위로)"
              disabled={deptno ? true : false} // 수정 시 부서 번호 변경 불가
            />
            <button 
              type="button" 
              onClick={handleCheckDeptno} 
              className="btn btn-secondary ms-2"
              disabled={deptno ? true : false} // 수정 시 중복 확인 버튼 비활성화
            >
              중복 확인
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>부서 이름</label>
          <input
            type="text"
            name="dname"
            value={dept.dname}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>위치</label>
          <input
            type="text"
            name="loc"
            value={dept.loc}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">저장</button>
      </form>
    </div>
  );
};

export default DeptForm;
