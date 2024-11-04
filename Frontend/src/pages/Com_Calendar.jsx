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

const Com_Calendar = () => {
  const [days, setDays] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const prevEndDate = new Date(endDate);
    prevEndDate.setDate(prevEndDate.getDate() - 7);

    setStartDate(formatDateToYYYYMMDD(prevStartDate));
    setEndDate(formatDateToYYYYMMDD(prevEndDate));

    fetchData(
      formatDateToYYYYMMDD(prevStartDate),
      formatDateToYYYYMMDD(prevEndDate)
    );
  };

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
    <div className="dashboard">
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <span className="search-icon">
              <MdOutlineSearch />
            </span>
            <input type="text" placeholder="Search" />
          </div>
          <div className="header-actions">
            <button className="icon-button">&#128276;</button>
            <button className="icon-button">&#128100;</button>
          </div>
        </header>

        <div className="calendar-header">
          <div className="title">
            <h1>Cuộc hẹn với người dùng</h1>
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
                        {apt.user.full_name}
                      </div>
                      <div className="appointment-time">{apt.timeWorking}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Com_Calendar;
