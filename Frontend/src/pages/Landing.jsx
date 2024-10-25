import React from 'react';
import deservebetter from '../assets/images/Deservebetter.png';
import deserve from '../assets/images/log_deserve.png';
import timelanding from '../assets/images/timelanding.png';
import image1 from '../assets/images/image-1.svg';
import image2 from '../assets/images/image-2.svg';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/LandingPage';


const Landing = () => {
  return (
    <Wrapper>
      <div className="landing-container">
        <header className="landing-header">
          <img src={deservebetter} alt="deservebetter" className="logo-img" />
          <div className="landing-doublebutton">
            <Link to='/register' className='header-button register-link'>
              Đăng ký
            </Link>
            <Link to='/login' className='header-button'>
              Đăng nhập
            </Link>
          </div>
        </header>
        <img src={image1} alt="Main" className="main-img" />

        <div className="nav-bar">
          <div className="nav-section greeting">Xin chào</div>
          <div className="nav-section home">Trang chủ</div>
        </div>

        <div className="section">
          <div className="card">
            <p className="card-text">
              Làm thế nào để bạn ưu tiên các nhiệm vụ hàng ngày khi có quá nhiều công việc?
            </p>
            <img src={timelanding} alt="Image 1" className="section-img" />
          </div>
          <div className="card">
            <p className="card-text">
              Bạn đã bao giờ thực sự làm chủ thời gian của mình hay chỉ đang phản ứng với các sự kiện xảy ra xung quanh?
            </p>
            <img src={timelanding} alt="Image 2" className="section-img" />
          </div>
        </div>

        <div className="time-img-container">
          <img src={image2} alt="Time Image" className="time-img" />
        </div>

        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-section about">
              <h2>Country & Region : Đà nẵng Việt Nam</h2>
              <p>Chúng tôi là một công ty chuyên cung cấp các dịch vụ và sản phẩm chất lượng cao.</p>
              <div className="contact">
                <span><FaEnvelope /> <a href="mailto:info@example.com">Email: info@example.com</a></span>
                <span><FaMapMarkerAlt /> Địa chỉ: 54 Nguyễn Lương Bằng, Hoa Khánh, Liên Chiểu, Đà Nẵng</span>
              </div>
            </div>
            <div className="footer-section links">
              <h2>Liên Hệ</h2>
              <ul>
                <li><a href="https://www.facebook.com/example" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a></li>
                <li><a href="https://www.youtube.com/example" target="_blank" rel="noopener noreferrer"><FaYoutube /> YouTube</a></li>
                <li><a href="https://www.instagram.com/example" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a></li>
              </ul>
            </div>
            <div className="footer-section logo">
              <img src={deserve} alt="deservebetter" className="logo-img" />
              <p className="logo-text">Deserve better</p>
            </div>

          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Deserve Better. Tất cả các quyền được bảo lưu.</p>
          </div>
        </footer>
      </div>
    </Wrapper>

  );
};

export default Landing;