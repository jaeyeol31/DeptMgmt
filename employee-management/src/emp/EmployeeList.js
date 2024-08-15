import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';
import { getDepartmentName, departmentMap } from '../constants';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);
    const [searchName, setSearchName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedJob, setSelectedJob] = useState(''); // 직업 필터링
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    useEffect(() => {
        EmployeeService.getAllEmployees().then((response) => {
            setEmployees(response.data);
            setFilteredEmployees(response.data);
        });
    }, []);

    useEffect(() => {
        let results = [...employees];
        
        // 이름으로 필터링
        if (searchName) {
            results = results.filter(employee => employee.ename.toLowerCase().includes(searchName.toLowerCase()));
        }

        // 입사 기간으로 필터링
        if (startDate && endDate) {
            results = results.filter(employee => {
                const hireDate = new Date(employee.hiredate);
                return hireDate >= new Date(startDate) && hireDate <= new Date(endDate);
            });
        }

        // 부서별 필터링
        if (selectedDepartment) {
            results = results.filter(employee => employee.deptno === parseInt(selectedDepartment));
        }

        // 직업별 필터링
        if (selectedJob) {
            results = results.filter(employee => employee.job === selectedJob);
        }

        // 입사 날짜 정렬
        results.sort((a, b) => {
            const dateA = new Date(a.hiredate);
            const dateB = new Date(b.hiredate);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setFilteredEmployees(results);
    }, [searchName, startDate, endDate, selectedDepartment, selectedJob, sortOrder, employees]);

    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
    const displayedEmployees = filteredEmployees.slice(
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

            {/* 검색 및 필터링 폼 */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="이름으로 검색"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="form-control mb-2"
                />
                <div className="d-flex mb-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control me-2"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="d-flex mb-2">
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="form-control me-2"
                    >
                        <option value="">부서 선택</option>
                        {Object.entries(departmentMap).map(([deptno, department]) => (
                            <option key={deptno} value={deptno}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="form-control"
                    >
                        <option value="">직업 선택</option>
                        {[...new Set(employees.map(employee => employee.job))].map((job, index) => (
                            <option key={index} value={job}>
                                {job}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="btn btn-secondary mb-3"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                    {sortOrder === 'asc' ? '입사일: 오래된 순' : '입사일: 최신 순'}
                </button>
            </div>

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