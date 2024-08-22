import React, { useState, useEffect } from 'react';
import NoticeService from '../services/NoticeService';

const categoryNames = {
  ALL: '전체 공지사항',
  URGENT: '긴급 공지사항',
  HR: '인사 관련 공지사항',
  IT_SECURITY: '보안 및 IT 및 규정 및 정책 관련',
  PROJECT_WORK: '프로젝트 및 업무 관련',
  COMPANY_NEWS: '사내 소식 및 행사 및 이벤트',
};

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetchNotices(selectedCategory);
  }, [selectedCategory]);

  const fetchNotices = (category) => {
    if (category === 'ALL') {
      NoticeService.getNoticesWithPagination(0, 6).then((response) => {
        setNotices(response.data.content);
      });
    } else {
      NoticeService.getNoticesWithPagination(0, 6).then((response) => {
        const filteredNotices = response.data.content.filter(
          (notice) => notice.category === category
        );
        setNotices(filteredNotices);
      });
    }
  };

  return (
    <div className="mb-4" style={styles.noticeBoard}>
      <h2 className="mb-3">사내 공지사항</h2>
      <div className="d-flex">
        <div style={styles.categoryList}>
          <ul className="list-group">
            {Object.entries(categoryNames).map(([key, name]) => (
              <li
                key={key}
                className={`list-group-item ${
                  selectedCategory === key ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(key)}
                style={{ cursor: 'pointer' }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.noticeList} className="ms-3">
          <ul className="list-group">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <li key={notice.id} className="list-group-item">
                  <a
                    href={`/notices/detail/${notice.id}`}
                    className="text-decoration-none"
                  >
                    {notice.title}
                  </a>
                </li>
              ))
            ) : (
              <li className="list-group-item">
                해당 카테고리에 공지사항이 없습니다.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  noticeBoard: {
    marginBottom: '20px',
  },
  categoryList: {
    width: '30%',
  },
  noticeList: {
    width: '70%',
  },
  activeListItem: {
    backgroundColor: '#007bff',
    color: 'white',
  },
};

export default NoticeBoard;
