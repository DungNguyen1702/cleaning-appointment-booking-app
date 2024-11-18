import React, { useState, useEffect } from "react";
import {
  MdOutlineSearch,
  MdOutlineNavigateNext,
  MdOutlineNavigateBefore,
} from "react-icons/md";
import "./Com_Calendar.scss";
import companyAPI from "../api/companyAPI";
import useAuth from "../hooks/useAuth";
import LoadingOverlay from "../components/loading_overlay";
import DatePicker from 'react-datepicker'; // Add this import at the top of your file
import 'react-datepicker/dist/react-datepicker.css'; // Add this import for the DatePicker styles

const Com_Calendar = () => {
  const [days, setDays] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const timeSlots = [
    { id: 'accepted', label: 'Đã Chấp Nhận', color: '#FFF3C4', textColor: '#FFC107' },
    { id: 'rejected', label: 'Hủy', color: '#F5C3C8', textColor: '#DC3545' },
    { id: 'done', label: 'Hoàn Thành', color: '#BADBCC', textColor: '#198754' },
    { id: 'pending', label: 'Chờ Xử Lý', color: '#D0C9FF', textColor: '#624BFF' }
  ];
  const { account } = useAuth();
  const fetchData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const response = await companyAPI.getRequestCustomer(
        account.company_id,
        startDate,
        endDate
      );
      console.log(response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Thứ 2
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Chủ nhật

    setStartDate(formatDateToYYYYMMDD(startOfWeek));
    setEndDate(formatDateToYYYYMMDD(endOfWeek));

    fetchData(
      formatDateToYYYYMMDD(startOfWeek),
      formatDateToYYYYMMDD(endOfWeek)
    );
  }, []);

  const handleTodayClick = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Thứ 2
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Chủ nhật

    setStartDate(formatDateToYYYYMMDD(startOfWeek));
    setEndDate(formatDateToYYYYMMDD(endOfWeek));

    fetchData(
      formatDateToYYYYMMDD(startOfWeek),
      formatDateToYYYYMMDD(endOfWeek)
    );
  };

  const handleNextWeekClick = () => {
    const nextStartDate = new Date(startDate);
    nextStartDate.setDate(nextStartDate.getDate() + 7);
    setSelectedDate(nextStartDate);
    const nextEndDate = new Date(endDate);
    nextEndDate.setDate(nextEndDate.getDate() + 7);

    setStartDate(formatDateToYYYYMMDD(nextStartDate));
    setEndDate(formatDateToYYYYMMDD(nextEndDate));

    fetchData(
      formatDateToYYYYMMDD(nextStartDate),
      formatDateToYYYYMMDD(nextEndDate)
    );
  };

  const handlePrevWeekClick = () => {
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 7);
    setSelectedDate(prevStartDate);
    const prevEndDate = new Date(endDate);
    prevEndDate.setDate(prevEndDate.getDate() - 7);

    setStartDate(formatDateToYYYYMMDD(prevStartDate));
    setEndDate(formatDateToYYYYMMDD(prevEndDate));

    fetchData(
      formatDateToYYYYMMDD(prevStartDate),
      formatDateToYYYYMMDD(prevEndDate)
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Calculate the start of the week containing the selected date
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    
    // Calculate the end of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    
    // Update the startDate and endDate states
    setStartDate(formatDateToYYYYMMDD(startOfWeek));
    setEndDate(formatDateToYYYYMMDD(endOfWeek));
    
    // Fetch data for the new week
    fetchData(formatDateToYYYYMMDD(startOfWeek), formatDateToYYYYMMDD(endOfWeek));
  };

  useEffect(() => {
    const today = new Date();
    handleDateChange(today); // This will set up the initial week and fetch data
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysArray = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayName = new Intl.DateTimeFormat("vi-VN", {
          weekday: "long",
        }).format(d);
        const dayDate = d.toLocaleDateString("vi-VN");
        daysArray.push({ name: dayName, date: dayDate });
      }

      setDays(daysArray);
    }
  }, [startDate, endDate]);

  return (
    <div className="calendarcontainer">
      <main className="main-content">
        <div className="title">
          <h1>Cuộc hẹn với người dùng</h1>
        </div>
        <header className="top-header">
          {/* <div className="search-bar">
            <span className="search-icon">
              <MdOutlineSearch />
            </span>
            <input type="text" placeholder="Search" />
          </div> */}
          {/* <div className="header-actions">
            <button className="icon-button">&#128276;</button>
            <button className="icon-button">&#128100;</button>
          </div> */}
        </header>

        <div className="calendar-header">
          <div className="date-picker-container">
            <DatePicker
               selected={selectedDate}
               onChange={handleDateChange}
               dateFormat="dd/MM/yyyy"
               className="date-picker-input"
            />
          </div>
          <div className="calendar-actions">
            <button className="nav-button" onClick={handlePrevWeekClick}>
              <MdOutlineNavigateBefore />
            </button>
            <button className="nav-button" onClick={handleNextWeekClick}>
              <MdOutlineNavigateNext />
            </button>
            <button className="today-button" onClick={handleTodayClick}>
              hôm nay
            </button>
          </div>
        </div>

        <div className="calendar-body">
          <div className="time-slots">
            <div className="time-slots-header">
              {timeSlots.map(slot => (
                <div 
                  key={slot.id} 
                  className="time-slot"
                  style={{ 
                    backgroundColor: slot.color,
                    color: slot.textColor
                  }}
                >
                {slot.label}
                </div>
              ))}
            </div>
          </div>

        {loading ? (
          <LoadingOverlay loading={loading} />
        ) : (
          <div className="calendar-grid">
            {days.map((day, index) => (
              <div key={index} className="day-column">
                <div className="day-header">
                  <span className="day-name">{day.name}</span>
                  <span className="day-date">{day.date}</span>
                </div>
                <div className="day-separator"></div>
                <div className="appointments">
                  {appointments[
                    day.name
                      .toUpperCase()
                      .replace(/\s+/g, "_")
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                  ]?.map((apt, aptIndex) => (
                    <div
                      key={aptIndex}
                      className={`appointment ${apt.status.toLowerCase()}`}
                    >
                      <div className="appointment-name">
                        {apt.name}
                      </div>
                      <div className="appointment-time">{apt.timeWorking}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </main>
    </div>
  );
};

export default Com_Calendar;
