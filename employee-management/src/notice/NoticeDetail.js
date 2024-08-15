import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NoticeService from '../services/NoticeService';

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (id) {
      NoticeService.getNoticeById(id).then((response) => {
        setNotice(response.data);
      });
    }
  }, [id]);

  if (!notice) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{notice.title}</h1>
      <div>
        {notice.attachment && (
          <a href={`http://localhost:8080${notice.attachment}`} download>
            {notice.attachment.split('/').pop()} 다운로드
          </a>
        )}
        <span> | 작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
      </div>
      <hr />
      {notice.thumbnail && (
        <img
          src={`http://localhost:8080${notice.thumbnail}`}
          alt="섬네일"
          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '20px' }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: notice.content }}></div>
    </div>
  );
};

export default NoticeDetail;
