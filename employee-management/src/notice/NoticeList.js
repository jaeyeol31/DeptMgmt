import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticeService from '../services/NoticeService';

const NoticeList = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        NoticeService.getAllNotices().then(response => {
            setNotices(response.data);
        });
    }, []);

    const deleteNotice = (id) => {
        NoticeService.deleteNotice(id).then(() => {
            setNotices(notices.filter(notice => notice.id !== id));
        });
    };

    return (
        <div>
            <h2>공지사항 목록</h2>
            <Link to="/notices/add" className="btn btn-primary mb-3">공지사항 추가</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map(notice => (
                        <tr key={notice.id}>
                            <td>{notice.title}</td>
                            <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/notices/detail/${notice.id}`} className="btn btn-info">보기</Link>
                                <Link to={`/notices/edit/${notice.id}`} className="btn btn-warning ms-2">수정</Link>
                                <button onClick={() => deleteNotice(notice.id)} className="btn btn-danger ms-2">삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NoticeList;
