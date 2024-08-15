import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NoticeService from '../services/NoticeService';

const categoryNames = {
  HR: '인사 관련 공지사항',
  IT_SECURITY: '보안 및 IT 및 규정 및 정책 관련',
  PROJECT_WORK: '프로젝트 및 업무 관련',
  COMPANY_NEWS: '사내 소식 및 행사 및 이벤트',
  URGENT: '긴급 공지사항',
};

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [previousNotice, setPreviousNotice] = useState(null);
  const [nextNotice, setNextNotice] = useState(null);

  useEffect(() => {
    if (id) {
      NoticeService.getNoticeById(id).then((response) => {
        setNotice(response.data);
      });

      NoticeService.getPreviousNotice(id).then((response) => {
        setPreviousNotice(response.data);
      });

      NoticeService.getNextNotice(id).then((response) => {
        setNextNotice(response.data);
      });
    }
  }, [id]);

  if (!notice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{notice.title}</h2>
          <hr /> {/* 제목과 아래 내용을 구분하는 구분선 */}
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th style={{ width: '150px' }}>공지사항 번호</th>
                <td>{notice.noticeNumber}</td>
              </tr>
              <tr>
                <th>조회수</th>
                <td>{notice.views}</td>
              </tr>
              <tr>
                <th>작성일</th>
                <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>카테고리</th>
                <td>{categoryNames[notice.category]}</td> {/* 카테고리 한글로 출력 */}
              </tr>
              <tr>
                <th>세부 카테고리</th>
                <td>{notice.subcategory}</td>
              </tr>
              {notice.attachment && (
                <tr>
                  <th>첨부파일</th>
                  <td>
                    <a href={`http://localhost:8080/api/notices/download/attachments/${notice.attachment}`} download>
                      {notice.attachment} 다운로드
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <hr /> {/* 테이블과 본문 내용을 구분하는 구분선 */}
          {notice.thumbnail && (
            <img
              src={`http://localhost:8080${notice.thumbnail}`}
              alt="섬네일"
              className="img-fluid rounded mb-3"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
          )}
          <div className="content" style={{ whiteSpace: 'pre-line' }}>
            {notice.content}
          </div>

          <hr />

          <div className="d-flex flex-column align-items-start">
            {previousNotice && (
              <Link to={`/notices/detail/${previousNotice.id}`} className="btn btn-secondary mb-3">
                이전글: {previousNotice.title}
              </Link>
            )}
            {nextNotice && (
              <Link to={`/notices/detail/${nextNotice.id}`} className="btn btn-secondary">
                다음글: {nextNotice.title}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
