import React, { useEffect, useState } from "react";

import "./AddEvent.scss";

import deleteIcon from "../assets/icons/delete.png";
import clockIcon from "../assets/icons/clock.png";
import penIcon from "../assets/icons/pen.png";
import addIcon from "../assets/icons/add-event.png";
import locationIcon from "../assets/icons/location.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import TimePicker from "react-time-picker"


const AddEvent = ({ onClose, open,func_CreateEvent }) => {
  const [title, setTitle] = useState("");
  const [selectDate, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState("KHONG_LAP_LAI");
  const [repeatFrequency, setRepeatFrequency] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDays, setSelectedDays] = useState("");

  const addEvent = (e) => {
    e.preventDefault();
    console.log(postData);
    func_CreateEvent(postData);
    // onClose();
  };

  
  
  const daysMap = {

    T2:"THU_HAI",
    T3:"THU_BA",
    T4:"THU_TU",
    T5:"THU_NAM",
    T6:"THU_SAU",
    T7:"THU_BAY",
    CN:"CHU_NHAT"
  }
  const daysArray = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const toggleDay = (day) => {
    // const dayValue = daysMap[day]
    // setSelectedDays(dayValue
    // );
  };
  // const addEvent = () => {
  //   console.log(repeatFrequency)
  // }
  
  useEffect(()=>
    {
      if (repeat==="LAP_LAI"){
        if (selectDate!==""){
          const dayKey = daysArray[selectDate.getDay()]
          const dayValue = daysMap[dayKey]
          setSelectedDays(dayValue)
          setRepeatFrequency(1);
          setRepeatInterval("TUAN");
        }
      }
      else{
        setSelectedDays("");
        setRepeatFrequency("");
        setRepeatInterval("");
      } 
    },
    [repeat, selectDate]
  );
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const postData = {
    description:title,
    due_date:formatDate(selectDate),
    start_time:startTime+":00",
    end_time:endTime+":00",
    task_content:taskContent,
    location:location,
    status:"PENDING",
    repeatOtion:repeat,
    repeatDays:selectedDays,
    repeatWeekMonth:repeatInterval,
    repeatInterval:repeatFrequency,
    
  }
  return (
    <div className="event-modal-hon">
      <div className="modal-container">
        <img
            src={deleteIcon}
            className="delete-icon"
            alt="Delete"
            onClick={onClose}
        />
        <img
            src={addIcon}
            className="add-event-icon"
            alt="Add"
            onClick={addEvent}
        />
        <button></button>
        <div className="header-left">
          <div className="title-header">Tạo sự kiện</div>
          <hr />
        </div>
        <div className="content">
          <div className="row-input">
            <div className="image-icon"></div>
            <div className="input-content">
              <input type="text" className="input-title" placeholder="Thêm tiêu đề" value={title} required onChange={(e)=>setTitle(e.target.value)}/>
            </div>
          </div>
          
          <div className="row-input">
            <div className="image-icon">
              <img src={clockIcon} alt="" />
            </div>
            <div className="time-loop">
              <div className="input-time">
                <div className="input-date">
                  <DatePicker
                    selected={selectDate}
                    onChange={(date) => setDate(date)}
                    dateFormat="yyyy-mm-dd"
                    locale={vi} // Tiếng Việt
                    placeholderText="Chọn ngày"
                    className="data-picker"
                    required
                  />
                  {selectDate && (
                    <span>
                      {format(selectDate, "EEEE, dd MMMM", { locale: vi })}
                    </span>
                  )}
                </div>
              
                <div className="input-hour">
                  <div>
                  <TimePicker 
                    
                    onChange={setStartTime} 
                    value={startTime}
                    clearIcon={null} 
                    clockIcon={null} 
                    className="start-time-picker"
                    required
                  />
                  </div>
                  <span>-</span>
                  <div>
                  <TimePicker 
                    
                    onChange={setEndTime} 
                    value={endTime}
                    clearIcon={null} 
                    clockIcon={null} 
                    className="end-time-picker"
                    required
                  />
                  </div>
                </div>
              </div>

              <div className="loop">
                <div className="loop-left">
                <select
                  className="select-repeat" 
                  value={repeat} 
                  onChange={
                    (e)=>setRepeat(e.target.value)
                  }>
                  <option value="LAP_LAI">Lặp lại</option>
                  <option value="KHONG_LAP_LAI">Không lặp lại</option>
      
                </select>
                </div>
                <div className="loop-right">
                  <div className="days-loop">
                    <label htmlFor="">Cứ lặp lại vào mỗi</label>
                    <div>
                    {Object.keys(daysMap).map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        style={{
                          width:'25px',
                          height:'25px',
                          margin: "5px",
                          padding: "2px",
                          borderRadius:"50%",
                          background: selectedDays===daysMap[day] ? "#F5C3C8" : "#ccc",
                          color: selectedDays===daysMap[day] ? "#102C57" : "#000",
                          fontSize:'14px',
                          fontWeight:'550',
                          border:'none'
                        }}
                      >
                        {day}
                      </button>
                    ))}
                    </div>

                  </div>
                  <div className="frep-loop">
                    <label htmlFor="">Cứ mỗi</label>
                    <input type="number" name="" id="" min={1} value={repeatFrequency} onChange={(e)=>setRepeatFrequency(e.target.value)} disabled={repeat==="KHONG_LAP_LAI"}/>
                    <div className="select-repeatWeekMonth" >
                      <select className="select-repeat-interval" name="time-loop" id="" value={repeatInterval} onChange={(e)=>setRepeatInterval(e.target.value)}>
                        <option value="TUAN">Tuần</option>
                        <option value="THANG">Tháng</option>
                      </select>

                      {repeat==="KHONG_LAP_LAI" && 
                        (
                          <span></span>
                        )
                      }

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row-input">
            <div className="image-icon">
              <img src={penIcon} alt="" />
            </div>
            <div className="label-input">
              <label htmlFor="content-work">Nội dung công việc</label>
              <textarea 
                id="content-work" 
                type="text" 
                value={taskContent} 
                required
                onChange={(e)=>setTaskContent(e.target.value)} />
            </div>
          </div>
          <div className="row-input">
            <div className="image-icon">
              <img src={locationIcon} alt="" />
            </div>
            <div className="label-input">
              <label htmlFor="location">Địa điểm</label>
              <input 
                id="location" 
                type="text" 
                required
                value={location} 
                onChange={(e)=>setLocation(e.target.value)} />

            </div>
          </div>
        </div>

        


      </div>
    </div>
  );
};

export default AddEvent;
