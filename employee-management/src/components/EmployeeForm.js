import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    ename: '',
    job: '',
    mgr: null,
    hiredate: '',
    sal: '',
    comm: '',
    deptno: ''
  });

  useEffect(() => {
    if (id) {
      EmployeeService.getEmployeeById(id).then((response) => {
        setEmployee(response.data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      EmployeeService.updateEmployee(id, employee).then(() => {
        navigate('/');
      });
    } else {
      EmployeeService.addEmployee(employee).then(() => {
        navigate('/');
      });
    }
  };

  return (
    <div>
      <h2>{id ? '직원 수정' : '직원 추가'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="ename"
            value={employee.ename}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>직업</label>
          <input
            type="text"
            name="job"
            value={employee.job}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>담당 매니저</label>
          <input
            type="number"
            name="mgr"
            value={employee.mgr || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>입사일</label>
          <input
            type="date"
            name="hiredate"
            value={employee.hiredate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>급여</label>
          <input
            type="number"
            name="sal"
            value={employee.sal}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>커미션</label>
          <input
            type="number"
            name="comm"
            value={employee.comm}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>부서</label>
          <input
            type="number"
            name="deptno"
            value={employee.deptno}
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

export default EmployeeForm;
