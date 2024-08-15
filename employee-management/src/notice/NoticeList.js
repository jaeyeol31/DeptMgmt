import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticeService from '../services/NoticeService';

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10; // 한 페이지에 보여줄 공지사항 수

    useEffect(() => {
        fetchNotices(currentPage);
    }, [currentPage]);

    const fetchNotices = (page) => {
        NoticeService.getNoticesWithPagination(page - 1, pageSize).then(response => {
            setNotices(response.data.content);
            setTotalPages(response.data.totalPages);
        });
    };

    const deleteNotice = (id) => {
        NoticeService.deleteNotice(id).then(() => {
            fetchNotices(currentPage);
        });
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h2>공지사항 목록</h2>
            <Link to="/notices/add" className="btn btn-primary mb-3">공지사항 추가</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>조회수</th>
                        <th>작성일</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map(notice => (
                        <tr key={notice.id}>
                            <td>{notice.noticeNumber}</td>
                            <td>
                                <Link to={`/notices/detail/${notice.id}`}>
                                    {notice.title}
                                </Link>
                            </td>
                            <td>{notice.views}</td>
                            <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/notices/edit/${notice.id}`} className="btn btn-warning">수정</Link>
                                <button onClick={() => deleteNotice(notice.id)} className="btn btn-danger ms-2">삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
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

export default NoticeList;
