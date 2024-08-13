import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeptService from '../services/DeptService';

const DeptForm = () => {
  const { id: deptno } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState({
    dname: '',
    loc: ''
  });

  useEffect(() => {
    if (deptno) {
      DeptService.getDeptById(deptno).then((response) => {
        setDept(response.data);
      });
    }
  }, [deptno]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDept(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
