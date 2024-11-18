import React from 'react';
import './Schedule.scss';

const Schedule = () => {
  const timeSlots = [
    { id: 'morning', label: 'Sáng', color: '#FFF3C4', textColor: '#FFC107' },
    { id: 'afternoon', label: 'Chiều', color: '#F5C3C8', textColor: '#DC3545' },
    { id: 'evening', label: 'Tối', color: '#BADBCC', textColor: '#198754' },
    { id: 'night', label: 'Khuya', color: '#D0C9FF', textColor: '#624BFF' }
  ];

  const days = [
    { name: 'Thứ 2', date: '9/9/2024' },
    { name: 'Thứ 3', date: '10/9/2024' },
    { name: 'Thứ 4', date: '11/9/2024' },
    { name: 'Thứ 5', date: '12/9/2024' },
    { name: 'Thứ 6', date: '13/9/2024' },
    { name: 'Thứ 7', date: '14/9/2024' },
    { name: 'Chủ nhật', date: '15/9/2024' }
  ];

  const events = [
    { day: 0, time: '10:30-11:30 AM', title: 'Quét nhà, lau nhà', color: '#FFF3C4' },
    { day: 0, time: '12:30-13:30 PM', title: 'Giặt đồ, lau nhà', color: '#F5C3C8' },
    { day: 0, time: '15:30-16:30 PM', title: 'Đi chợ, mua rau, mua cá về bỏ tủ lạnh', color: '#F5C3C8' },
    { day: 1, time: '17:30-18:30 PM', title: 'Nấu ăn cho cả tuần bỏ tủ lạnh', color: '#BADBCC' },
    { day: 2, time: '10:30-11:30 AM', title: 'Quét nhà, lau nhà', color: '#FFF3C4' },
    { day: 2, time: '21:30-22:30 PM', title: 'Đi chợ, mau rau, mua cá về bỏ tủ lạnh', color: '#BADBCC' },
    { day: 3, time: '23:30-0:30 AM', title: 'Tập thể dục, đạp xe đạp quanh công viên', color: '#D0C9FF' },
    { day: 6, time: '10:30-11:30 AM', title: 'Quét nhà, lau nhà', color: '#FFF3C4' },
    { day: 6, time: '12:30-13:30 PM', title: 'Giặt đồ, lau nhà', color: '#F5C3C8' },
    { day: 6, time: '21:30-22:30 PM', title: 'Đi chợ, mau rau, mua cá về bỏ tủ lạnh', color: '#FFF3C4' }
  ];

  return (
    <><div className='h5-header'>
          <h5>Lịch trình trong tuần</h5>
      </div>
       <div className="calendar-container">
        <div className="calendar-header">
            <div className="header-controls">
                <div className="nav-and-date-wrapper">
                    <div className="navigation">
                        <div className="nav-buttons">
                            <button className="nav-button">&lt;</button>
                            <button className="nav-button">&gt;</button>
                            <button className="today-button">hôm nay</button>
                        </div>
                    </div>
                    <div className="date-range">
                        Ngày 9 -15 tháng 9 năm 2024
                    </div>
                </div>    
            </div>
        </div> 

        <div className="calendar-body">
            <div className="time-slots">
                <div className="time-slots-header">
                    <button className="create-event">+ Tạo sự kiện</button>
                    <p>danh sách sự kiện</p>
                    <p className="subtitle">Bạn có thể kéo thả hoặc click vào sự kiện</p>
                </div>
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

            <div className="calendar-grid">
                {days.map((day, index) => (
                    <div key={index} className="day-column">
                        <div className="day-header">
                            <span className="day-name">{day.name}</span>
                            <span className="day-date">{day.date}</span>
                        </div>
                        <div className="events">
                            {events
                                .filter(event => event.day === index)
                                .map((event, eventIndex) => (
                                    <div
                                        key={eventIndex}
                                        className="event"
                                        style={{ backgroundColor: event.color }}
                                    >
                                        <div className="event-title">{event.title}</div>
                                        <div className="event-time">{event.time}</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div></>
  );
};

export default Schedule;
