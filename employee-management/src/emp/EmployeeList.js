import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';
import { getDepartmentName, departmentMap } from '../constants';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);

    useEffect(() => {
        EmployeeService.getAllEmployees().then((response) => {
            setEmployees(response.data);
        });
    }, []);

    const totalPages = Math.ceil(employees.length / employeesPerPage);
    const displayedEmployees = employees.slice(
        (currentPage - 1) * employeesPerPage,
        currentPage * employeesPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <h2>직원 목록</h2>
            <Link to="/add" className="btn btn-primary mb-3">직원 추가</Link>
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>직업</th>
                        <th>부서</th>
                        <th>입사일</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedEmployees.map(employee => (
                        <tr key={employee.empno}>
                            <td>{employee.empno}</td>
                            <td>{employee.ename}</td>
                            <td>{employee.job}</td>
                            <td>{getDepartmentName(employee.deptno)}</td>
                            <td>{employee.hiredate}</td>
                            <td>
                                <Link to={`/view/${employee.empno}`} className="btn btn-info">보기</Link>
                                <Link to={`/edit/${employee.empno}`} className="btn btn-warning">수정</Link>
                                <button className="btn btn-danger">삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <nav>
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handlePreviousPage}>
                            이전
                        </button>
                    </li>
                    {[...Array(totalPages).keys()].map(number => (
                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                            <button onClick={() => handlePageChange(number + 1)} className="page-link">
                                {number + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handleNextPage}>
                            다음
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default EmployeeList;
