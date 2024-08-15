import React, { useState, useEffect } from 'react';
import NoticeService from './services/NoticeService';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const categoryNames = {
  ALL: '전체 공지사항',
  URGENT: '긴급 공지사항',
  HR: '인사 관련 공지사항',
  IT_SECURITY: '보안 및 IT 및 규정 및 정책 관련',
  PROJECT_WORK: '프로젝트 및 업무 관련',
  COMPANY_NEWS: '사내 소식 및 행사 및 이벤트',
};

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchRecentNotices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentNotices.length);
    }, 4000); // 4초마다 슬라이드 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
  }, [recentNotices]);

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

  const fetchRecentNotices = () => {
    NoticeService.getNoticesWithPagination(0, 5).then((response) => {
      setRecentNotices(response.data.content);
    });
  };

  const handleThumbnailClick = (id) => {
    navigate(`/notices/detail/${id}`);
  };

  return (
    <div className="container" style={styles.container}>
      {/* 상단 소개글 */}
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>환영합니다!</h1>
        <p style={styles.welcomeText}>우리 회사의 최신 소식과 업데이트를 확인하세요.</p>
      </div>

      {/* 배너 */}
      <div style={styles.bannerContainer}>
        <button
          className="carousel-control-prev"
          type="button"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + recentNotices.length) % recentNotices.length)
          }
          style={{ ...styles.controlButton, left: '-60px' }} // 버튼을 이미지 왼쪽 외부로 배치
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <div className="carousel slide" data-bs-ride="carousel" style={styles.banner}>
          <div className="carousel-inner">
            {recentNotices.map((notice, index) => (
              <div
                className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
                key={index}
              >
                <img
                  src={`http://localhost:8080${notice.thumbnail}`}
                  className="d-block w-100"
                  alt="섬네일"
                  onClick={() => handleThumbnailClick(notice.id)}
                  style={styles.slideImage}
                />
              </div>
            ))}
          </div>
          <div className="carousel-indicators" style={styles.indicators}>
            {recentNotices.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={index === currentSlide ? 'active' : ''}
                aria-current={index === currentSlide ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
                style={index === currentSlide ? styles.activeIndicator : styles.inactiveIndicator}
              ></button>
            ))}
          </div>
        </div>
        <button
          className="carousel-control-next"
          type="button"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % recentNotices.length)
          }
          style={{ ...styles.controlButton, right: '-60px' }} // 버튼을 이미지 오른쪽 외부로 배치
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* 사내 공지사항 */}
      <div className="mb-4">
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
                    <a href={`/notices/detail/${notice.id}`} className="text-decoration-none">
                      {notice.title}
                    </a>
                  </li>
                ))
              ) : (
                <li className="list-group-item">해당 카테고리에 공지사항이 없습니다.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 부서 게시판 */}
      <div>
        <h2 className="mb-3">부서 게시판</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>부서</th>
              <th>게시판 제목</th>
              <th>일정</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>마케팅팀</td>
              <td>워크샵 일정</td>
              <td>2024-09-15</td>
            </tr>
            <tr>
              <td>개발팀</td>
              <td>코드 리뷰 일정</td>
              <td>2024-09-20</td>
            </tr>
            <tr>
              <td>인사팀</td>
              <td>신규 채용 안내</td>
              <td>2024-09-25</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 푸터 */}
      <footer style={styles.footer}>
        <p>회사명: woduf Corp | 주소: 서울특별시 강남구 테헤란로 123</p>
        <p>전화번호: 02-123-4567 | 이메일: woduf31@gmail.com</p>
        <p>&copy; 2024 woduf Corp. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ced4da', // 배경색을 더 진한 색으로 변경
  },
  welcomeSection: {
    textAlign: 'center',
    padding: '26px 0',
    backgroundColor: '#ced4da',
    marginBottom: '20px',
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  welcomeText: {
    fontSize: '1.2rem',
    color: '#6c757d',
  },
  bannerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: '10px',
  },
  banner: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative', // 위치를 상대적으로 설정
  },
  slideImage: {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    cursor: 'pointer',
  },
  controlButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#333',
    padding: '0 20px',
    transform: 'translateY(-50%)', // 수직 중앙 정렬
  },
  indicators: {
    position: 'absolute',
    bottom: '10px', // 인디케이터를 이미지 하단에 위치
    left: '0',
    right: '0',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#333', // 슬라이드 위치 인디케이터의 활성화된 상태 색상
    border: '1px solid #fff',
    margin: '0 5px',
  },
  inactiveIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#ccc', // 슬라이드 위치 인디케이터의 비활성화된 상태 색상
    border: '1px solid #fff',
    margin: '0 5px',
  },
  categoryList: {
    width: '30%',
  },
  noticeList: {
    width: '70%',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: '20px',
  },
};

export default Home;
