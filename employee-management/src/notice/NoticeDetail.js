import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NoticeService from '../services/NoticeService';

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
        <div className="container mt-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">{notice.title}</h2>
                    <div className="d-flex justify-content-between">
                        <span>공지사항 번호: {notice.noticeNumber}</span>
                        <span>조회수: {notice.views}</span>
                        <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                    {notice.attachment && (
                        <div className="mt-3">
                            <a href={`http://localhost:8080/api/notices/download/attachments/${notice.attachment}`} download>
                                {notice.attachment} 다운로드
                            </a>
                        </div>
                    )}
                    <hr />
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
