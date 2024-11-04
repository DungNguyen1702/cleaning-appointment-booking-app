import React from 'react';
import { MdOutlineSearch, MdOutlineNavigateNext, MdOutlineNavigateBefore} from "react-icons/md";
import './Com_Calendar.scss';

const Com_Calendar = () => {
  const days = [
    { name: "Thứ 2", date: "9/9/2024" },
    { name: "Thứ 3", date: "10/9/2024" },
    { name: "Thứ 4", date: "11/9/2024" },
    { name: "Thứ 5", date: "12/9/2024" },
    { name: "Thứ 6", date: "13/9/2024" },
    { name: "Thứ 7", date: "14/9/2024" },
    { name: "Chủ nhật", date: "15/9/2024" },
  ];

  const appointments = [
    { day: 0, name: "Võ Việt Trường", time: "10:30-11:30 AM", color: "yellow" },
    { day: 0, name: "Lê Tuấn Nguyễn Khôi", time: "12:30-13:30 PM", color: "pink" },
    { day: 0, name: "Nguyễn Văn Dũng", time: "15:30-16:30 PM", color: "pink" },
    { day: 1, name: "Phạm Duy Tín", time: "17:30-18:30 PM", color: "green" },
    { day: 1, name: "Hoàng Minh Tín", time: "10:30-11:30 AM", color: "yellow" },
    { day: 1, name: "Huỳnh Thị Thục Vi", time: "12:30-13:30 PM", color: "pink" },
    { day: 2, name: "Anh Bình", time: "21:30-22:30 PM", color: "green" },
    { day: 2, name: "Trần Minh Quân", time: "12:30-13:30 PM", color: "pink" },
    { day: 3, name: "Hồ Văn Thảo", time: "23:30-0:30 AM", color: "purple" },
    { day: 4, name: "Bạch Huỳnh Hải Phương", time: "21:30-22:30 PM", color: "green" },
    { day: 5, name: "Kim Hiếu", time: "10:30-11:30 AM", color: "yellow" },
  ];

  return (
    <div className="dashboard">
      {/* <aside className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="Dash UI" />
          <span>Dash UI</span>
        </div>
        <nav className="nav-menu">
          <a href="#" className="nav-item">Trang chủ</a>
          <a href="#" className="nav-item">Tin nhắn</a>
          <a href="#" className="nav-item">Dịch vụ</a>
          <a href="#" className="nav-item active">Cuộc hẹn với người dùng</a>
          <a href="#" className="nav-item">Thông tin công ty</a>
        </nav>
      </aside> */}

      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <span className="search-icon"><MdOutlineSearch /></span>
            <input type="text" placeholder="Search" />
          </div>
          <div className="header-actions">
            <button className="icon-button">
              &#128276;
            </button>
            <button className="icon-button">
              &#128100;
            </button>
          </div>
        </header>

        <div className="calendar-header">
          <div className="title">
            <h1>Cuộc hẹn với người dùng</h1>
          </div>
          <div className="calendar-actions">
            <button className="nav-button">
              <MdOutlineNavigateBefore />
            </button>
            <button className="nav-button">
              <MdOutlineNavigateNext />
            </button>
            <button className="today-button">hôm nay</button>
          </div>
        </div>

        <div className="calendar-grid">
          {days.map((day, index) => (
            <div key={index} className="day-column">
              <div className="day-header">
                <span className="day-name">{day.name}</span>
                <span className="day-date">{day.date}</span>
              </div>
              <div className="day-separator"></div>
              <div className="appointments">
                {appointments
                  .filter(apt => apt.day === index)
                  .map((apt, aptIndex) => (
                    <div 
                      key={aptIndex} 
                      className={`appointment ${apt.color}`}
                    >
                      <div className="appointment-name">{apt.name}</div>
                      <div className="appointment-time">{apt.time}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Com_Calendar;