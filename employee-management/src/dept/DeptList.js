import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeptService from '../services/DeptService';

const DeptList = () => {
    const [depts, setDepts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deptsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLoc, setFilterLoc] = useState('All');

    useEffect(() => {
        fetchDepts();
    }, []);

    const fetchDepts = () => {
        DeptService.getAllDepts().then((response) => {
            const sortedDepts = response.data.sort((a, b) => a.deptno - b.deptno);
            setDepts(sortedDepts);
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterLoc(e.target.value);
    };

    const deleteDept = (deptno) => {
        if (window.confirm('정말로 이 부서를 삭제하시겠습니까?')) {
            DeptService.deleteDept(deptno).then(() => {
                fetchDepts(); // 삭제 후 목록 갱신
            });
        }
    };

    const filteredDepts = depts.filter(dept => {
        return (
            (dept.dname.toLowerCase().includes(searchTerm.toLowerCase()) || 
             dept.deptno.toString().includes(searchTerm)) && 
            (filterLoc === 'All' || dept.loc === filterLoc)
        );
    });

    const totalPages = Math.ceil(filteredDepts.length / deptsPerPage);
    const displayedDepts = filteredDepts.slice(
        (currentPage - 1) * deptsPerPage,
        currentPage * deptsPerPage
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
            <h2>부서 목록</h2>
            <Link to="/departments/add" className="btn btn-primary mb-3">부서 추가</Link>

            <div className="mb-3">
                <input
                    type="text"
                    placeholder="검색 (부서명 또는 부서번호)"
                    className="form-control"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="mb-3">
                <select className="form-select" value={filterLoc} onChange={handleFilterChange}>
                    <option value="All">전체 위치</option>
                    {[...new Set(depts.map(dept => dept.loc))].map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

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
                    {displayedDepts.map(dept => (
                        <tr key={dept.deptno}>
                            <td>{dept.deptno}</td>
                            <td>{dept.dname}</td>
                            <td>{dept.loc}</td>
                            <td>
                                <Link to={`/departments/detail/${dept.deptno}`} className="btn btn-info">보기</Link>
                                <Link to={`/departments/edit/${dept.deptno}`} className="btn btn-warning ms-2">수정</Link>
                                <button
                                    onClick={() => deleteDept(dept.deptno)}
                                    className="btn btn-danger ms-2"
                                >
                                    삭제
                                </button>
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

export default DeptList;
