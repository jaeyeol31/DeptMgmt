import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate 훅을 임포트
import NoticeBoard from './NoticeBoard';
import DepartmentBoard from './DepartmentBoard';
import NoticeService from '../services/NoticeService';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const [recentNotices, setRecentNotices] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();  // navigate 함수를 선언

  useEffect(() => {
    fetchRecentNotices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentNotices.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [recentNotices]);

  const fetchRecentNotices = () => {
    NoticeService.getNoticesWithPagination(0, 5).then((response) => {
      setRecentNotices(response.data.content);
    });
  };

  const handleThumbnailClick = (id) => {
    navigate(`/notices/detail/${id}`);  // navigate 함수를 사용
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>환영합니다!</h1>
        <p style={styles.welcomeText}>우리 회사의 최신 소식과 업데이트를 확인하세요.</p>
      </div>

      <div style={styles.bannerContainer}>
        <button
          className="carousel-control-prev"
          type="button"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + recentNotices.length) % recentNotices.length)
          }
          style={{ ...styles.controlButton, left: '-60px' }}
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
                style={
                  index === currentSlide
                    ? styles.activeIndicator
                    : styles.inactiveIndicator
                }
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
          style={{ ...styles.controlButton, right: '-60px' }}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <NoticeBoard />
      <DepartmentBoard />

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
    backgroundColor: '#ced4da',
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
    position: 'relative',
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
    transform: 'translateY(-50%)',
  },
  indicators: {
    position: 'absolute',
    bottom: '10px',
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
    backgroundColor: '#333',
    border: '1px solid #fff',
    margin: '0 5px',
  },
  inactiveIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    border: '1px solid #fff',
    margin: '0 5px',
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
