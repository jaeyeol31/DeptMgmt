import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticeService from '../services/NoticeService';

const categoryNames = {
  HR: '인사 관련 공지사항',
  IT_SECURITY: '보안 및 IT 및 규정 및 정책 관련',
  PROJECT_WORK: '프로젝트 및 업무 관련',
  COMPANY_NEWS: '사내 소식 및 행사 및 이벤트',
  URGENT: '긴급 공지사항',
};

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10; 

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage, categoryFilter, searchTerm]);

  const fetchNotices = (page) => {
    NoticeService.getNoticesWithPagination(page - 1, pageSize).then(response => {
      let filteredNotices = response.data.content;

      // 카테고리 필터링
      if (categoryFilter) {
        filteredNotices = filteredNotices.filter(notice => notice.category === categoryFilter);
      }

      // 검색 필터링
      if (searchTerm) {
        filteredNotices = filteredNotices.filter(notice => 
          notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setNotices(filteredNotices);
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

      {/* 카테고리 필터링 */}
      <div className="form-group">
        <label>카테고리 필터</label>
        <select
          className="form-control mb-3"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">전체</option>
          <option value="HR">인사 관련 공지사항</option>
          <option value="IT_SECURITY">보안 및 IT 및 규정 및 정책 관련</option>
          <option value="PROJECT_WORK">프로젝트 및 업무 관련</option>
          <option value="COMPANY_NEWS">사내 소식 및 행사 및 이벤트</option>
          <option value="URGENT">긴급 공지사항</option>
        </select>
      </div>

      {/* 검색 */}
      <div className="form-group">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="제목 또는 내용 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>카테고리</th>
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
              <td>{categoryNames[notice.category]}</td> {/* 카테고리 한글로 출력 */}
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
