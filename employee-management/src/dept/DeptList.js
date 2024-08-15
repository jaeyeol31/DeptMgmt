import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeptService from '../services/DeptService';

const DeptList = () => {
    const [depts, setDepts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deptsPerPage] = useState(10);

    useEffect(() => {
        DeptService.getAllDepts().then((response) => {
            setDepts(response.data);
        });
    }, []);

    const totalPages = Math.ceil(depts.length / deptsPerPage);
    const displayedDepts = depts.slice(
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
                                <button className="btn btn-danger ms-2">삭제</button>
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
