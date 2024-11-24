import React, { useState, useEffect } from "react";
import "./Schedule.scss";
import userAPI from "../api/userAPI"; // Import your API module
import LoadingOverlay from "../components/loading_overlay";
import useAuth from "../hooks/useAuth";

import AddEvent from "./AddEvent";
import EditEvent from "./EditEvent";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

const Schedule = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [days, setDays] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [repeatedTodos, setRepeatedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeSlotStates, setTimeSlotStates] = useState({
    morning: true,
    afternoon: true,
    evening: true,
    night: true,
  });

  const timeSlots = [
    {
      id: "morning",
      label: "Sáng (4:00 - 11:59)",
      color: "#FFF3C4",
      textColor: "#FFC107",
    },
    {
      id: "afternoon",
      label: "Chiều (12:00 - 17:59)",
      color: "#F5C3C8",
      textColor: "#DC3545",
    },
    {
      id: "evening",
      label: "Tối (18:00 - 22:59)",
      color: "#BADBCC",
      textColor: "#198754",
    },
    {
      id: "night",
      label: "Khuya (23:00 - 3:59)",
      color: "#D0C9FF",
      textColor: "#624BFF",
    },
  ];
  const dayMapping = {
    THU_HAI: "Monday",
    THU_BA: "Tuesday",
    THU_TU: "Wednesday",
    THU_NAM: "Thursday",
    THU_SAU: "Friday",
    THU_BAY: "Saturday",
    CHU_NHAT: "Sunday",
  };

  const isSunday = (date) => {
    return moment(date, "DD/MM/YYYY").day() === 0;
  };

  const getMondayOfWeek = (date) => {
    const dueDate = moment(date, "DD/MM/YYYY");
    if (isSunday(date)) {
      return dueDate.subtract(7, "days");
    } else {
      return dueDate.startOf("week").add("day");
    }
  };

  const calculateDisplayDates = (todo) => {
    const displayDates = [];
    const dueDate = moment(todo.due_date, "DD/MM/YYYY");
    const repeatOption = todo.todo_repeat.repeat_option;
    const repeatDays = todo.todo_repeat.repeat_days;
    const repeatWeekMonth = todo.todo_repeat.repeat_weekMonth;
    const repeatInterval = todo.todo_repeat.repeat_interval;
    if (repeatOption === "LAP_LAI") {
      if (repeatWeekMonth === "TUAN") {
        repeatDays.forEach((day) => {
          let currentDate = dueDate.clone();
          let startOfWeek = getMondayOfWeek(currentDate);
          let dayOfWeek = dayMapping[day];
          let dayOfWeekIndex;
          if (dayOfWeek === "Sunday") {
            dayOfWeekIndex = 7;
          } else {
            dayOfWeekIndex = moment.weekdays().indexOf(dayOfWeek);
          }
          let actualDate = startOfWeek.add(dayOfWeekIndex, "days");

          for (let i = 1; i <= repeatInterval; i++) {
            actualDate.add(1, "weeks");
            displayDates.push(actualDate.format("YYYY-MM-DD"));
          }
        });
      } else if (repeatWeekMonth === "THANG") {
        repeatDays.forEach((day) => {
          let currentDate = dueDate.clone();
          let startOfWeek = getMondayOfWeek(currentDate);
          let dayOfWeek = dayMapping[day];
          let dayOfWeekIndex;
          if (dayOfWeek === "Sunday") {
            dayOfWeekIndex = 7;
          } else {
            dayOfWeekIndex = moment.weekdays().indexOf(dayOfWeek);
          }
          let actualDate = startOfWeek.add(dayOfWeekIndex, "days");

          for (let i = 1; i <= repeatInterval; i++) {
            actualDate.add(1, "months");
            displayDates.push(actualDate.format("YYYY-MM-DD"));
          }
        });
      }
    }

    return displayDates;
  };

  const processTodos = (allTodos) => {
    const processedTodos = [];
    Object.keys(allTodos).forEach((day) => {
      allTodos[day].forEach((todo) => {
        const displayDates = calculateDisplayDates(todo);
        processedTodos.push({
          ...todo,
          displayDates,
        });
      });
    });
    return processedTodos;
  };

  const { account } = useAuth();

  const userId = account.user_id;

  const fetchAllData = async (userId) => {
    try {
      const response = await userAPI.getListAllTodo(userId);
      console.log(response.data);
      const processedTodos = processTodos(response.data);
      setRepeatedTodos(processedTodos);
      console.log("Todo repeat: ", processedTodos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async (userId, startDate, endDate) => {
    try {
      setLoading(true);
      const response = await userAPI.getListTodo(userId, startDate, endDate);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Thứ 2
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Chủ nhật

    setStartDate(formatDateToYYYYMMDD(startOfWeek));
    setEndDate(formatDateToYYYYMMDD(endOfWeek));

    fetchData(
      userId,
      formatDateToYYYYMMDD(startOfWeek),
      formatDateToYYYYMMDD(endOfWeek)
    );
    setRepeatedTodos([]);
    fetchAllData(userId);
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
    setRepeatedTodos([]);
    fetchAllData(userId);
  }, [startDate, endDate]);

  const handleTodayClick = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Thứ 2
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Chủ nhật

    setStartDate(formatDateToYYYYMMDD(startOfWeek));
    setEndDate(formatDateToYYYYMMDD(endOfWeek));

    fetchData(
      userId,
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
      userId,
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
      userId,
      formatDateToYYYYMMDD(prevStartDate),
      formatDateToYYYYMMDD(prevEndDate)
    );
  };

  const calculateEndTime = (timeWorking, workingHours) => {
    const [hours, minutes] = timeWorking.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + workingHours * 60;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0"
    )}`;
  };

  const getTimeSlot = (timeWorking) => {
    const [hours] = timeWorking.split(":").map(Number);
    if (hours >= 4 && hours < 12) return "morning";
    if (hours >= 12 && hours < 18) return "afternoon";
    if (hours >= 18 && hours < 23) return "evening";
    if (hours >= 23 && hours < 4) return "night";
    return "night"; // Default to night for hours >= 23 or < 4
  };

  const handleTimeSlotClick = (slotId) => {
    setTimeSlotStates((prevState) => ({
      ...prevState,
      [slotId]: !prevState[slotId],
    }));
  };

  //code của NHCon

  const [prop, setProp] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenEditnModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleClickOpenEditModal = (event) => {
    setProp(event);
    setOpenEditModal(true);
  };

  const createEvent = async (postData) => {
    try {
      await userAPI.createToDo(postData);
      toast.success("Tạo sự kiện thành công", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to create todo status:", error);
      toast.error(
        error.response?.data.message || "Tạo sự kiện không thành công",
        {
          position: "top-right",
        }
      );
    } finally {
      if (postData?.due_date >= startDate && postData?.due_date <= endDate) {
        fetchData(userId, startDate, endDate);
      }
      setOpenModal(false);
    }
  };
  const editEvent = async (postData, id) => {
    try {
      await userAPI.editToDo(postData, id);
      toast.success("Chỉnh sửa sự kiện thành công", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to update event status:", error);
      toast.error(
        error.response?.data.message || "Chỉnh sửa sự kiện không thành công",
        {
          position: "top-right",
        }
      );
    } finally {
      fetchData(userId, startDate, endDate);

      setOpenEditModal(false);
    }
  };
  const deleteEvent = async (id) => {
    try {
      //console.log("I come here")
      await userAPI.deleteToDo(id);
      toast.success("Xoá sự kiện thành công", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to update event status:", error);
      toast.error(
        error.response?.data.message || "Xoá sự kiện không thành công",
        {
          position: "top-right",
        }
      );
    } finally {
      fetchData(startDate, endDate);

      setOpenEditModal(false);
    }
  };

  // Lọc các todo lặp lại có ngày nằm trong khoảng startDate và endDate
  const filteredRepeatedTodos = repeatedTodos.filter((todo) =>
    todo.displayDates.some((date) => {
      const todoDate = moment(date, "YYYY-MM-DD");
      return todoDate.isBetween(startDate, endDate, null, "[]");
    })
  );

  return (
    <div className="calendar-container">
      <ToastContainer />
      <div className="h5-header">
        <h5>Lịch trình trong tuần</h5>
      </div>
      <div className="calendar-header">
        <div className="header-controls">
          <div className="nav-and-date-wrapper">
            <div className="navigation">
              <div className="nav-buttons">
                <button className="nav-button" onClick={handlePrevWeekClick}>
                  &lt;
                </button>
                <button className="nav-button" onClick={handleNextWeekClick}>
                  &gt;
                </button>
                <button className="today-button" onClick={handleTodayClick}>
                  hôm nay
                </button>
              </div>
            </div>

            <div className="date-range">
              Ngày {startDate} - {endDate}
            </div>
          </div>
        </div>
      </div>

      <div className="calendar-body">
        <div className="time-slots">
          <div className="time-slots-header">
            <button className="create-event" onClick={handleOpenModal}>
              + Tạo sự kiện
            </button>
            <p>danh sách sự kiện</p>
            <p className="subtitle">
              Bạn có thể kéo thả hoặc click vào sự kiện
            </p>
          </div>
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="time-slot"
              style={{
                backgroundColor: timeSlotStates[slot.id] ? slot.color : "#ccc",
                color: timeSlotStates[slot.id] ? slot.textColor : "#666",
                cursor: "pointer",
              }}
              onClick={() => handleTimeSlotClick(slot.id)}
            >
              {slot.label}
            </div>
          ))}
        </div>

        {loading ? (
          <LoadingOverlay loading={loading} />
        ) : (
          <div className="calendar-grid">
            {days.map((day, index) => {
              const dayKey = day.name
                .toUpperCase()
                .replace(/\s+/g, "_")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
              const dayAppointments = (appointments[dayKey] || []).filter(
                (event) => timeSlotStates[getTimeSlot(event.timeWorking)]
              );

              const dayRepeatedTodos = filteredRepeatedTodos
                .filter((todo) =>
                  todo.displayDates.some((date) => {
                    const todoDate = moment(date, "YYYY-MM-DD");
                    const dayDate = moment(day.date, "D/M/YYYY"); // Chuyển đổi day.date thành đối tượng Moment
                    return todoDate.isSame(dayDate, "day");
                  })
                )
                .filter(
                  (todo) => timeSlotStates[getTimeSlot(todo.timeWorking)]
                );

              return (
                <div key={index} className="day-column">
                  <div className="day-header">
                    <span className="day-name">{day.name}</span>
                    <span className="day-date">{day.date}</span>
                  </div>
                  <div className="events">
                    {dayAppointments.map((event, eventIndex) => {
                      return (
                        <div
                          onClick={() => handleClickOpenEditModal(event)}
                          key={eventIndex}
                          className={`event`}
                          style={{
                            backgroundColor: timeSlots.find(
                              (slot) =>
                                slot.id === getTimeSlot(event.timeWorking)
                            ).color,
                            color: timeSlots.find(
                              (slot) =>
                                slot.id === getTimeSlot(event.timeWorking)
                            ).textColor,
                          }}
                        >
                          <div className="event-title">{event.description}</div>
                          <div className="event-time">{event.timeWorking}</div>
                        </div>
                      );
                    })}
                    {dayRepeatedTodos.map((todo, todoIndex) => {
                      return (
                        <div
                          onClick={() => handleClickOpenEditModal(todo)}
                          key={todoIndex}
                          className={`event`}
                          style={{
                            backgroundColor: timeSlots.find(
                              (slot) =>
                                slot.id === getTimeSlot(todo.timeWorking)
                            ).color,
                            color: timeSlots.find(
                              (slot) =>
                                slot.id === getTimeSlot(todo.timeWorking)
                            ).textColor,
                          }}
                        >
                          <div className="event-title">{todo.description}</div>
                          <div className="event-time">{todo.timeWorking}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {openModal && (
        <AddEvent
          open={openModal}
          onClose={handleCloseModal}
          func_CreateEvent={createEvent}
        />
      )}
      {openEditModal && (
        <EditEvent
          open={openEditModal}
          onClose={handleCloseEditModal}
          func={editEvent}
          props={prop}
          func_Delete={deleteEvent}
        />
      )}
    </div>
  );
};

export default Schedule;
