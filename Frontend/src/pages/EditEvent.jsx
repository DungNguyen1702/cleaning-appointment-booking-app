import React, { useEffect, useState } from "react";

import "./EditEvent.scss";

import deleteIcon from "../assets/icons/delete.png";
import clockIcon from "../assets/icons/clock.png";
import penIcon from "../assets/icons/pen.png";
import locationIcon from "../assets/icons/location.png";

import editIcon from "../assets/icons/edit.png";
import saveIcon from "../assets/icons/diskette.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format,parse } from "date-fns";
import { vi } from "date-fns/locale";
import TimePicker from "react-time-picker"


const EditEvent = ({ onClose, open, props,func }) => {
  
  const [noEdit,setNoEdit] = useState("1");  
  const [title, setTitle] = useState(props?.description);
  const [selectDate, setDate] = useState(parse(props?.due_date, "dd/MM/yyyy", new Date()));
  const [startTime, setStartTime] = useState(props?.start_time.substring(0, 5));
  const [endTime, setEndTime] = useState(props?.end_time.substring(0, 5));
  const [repeat, setRepeat] = useState(props?.todo_repeat?.repeat_option || "KHONG_LAP_LAI");
  const [repeatFrequency, setRepeatFrequency] = useState(props?.todo_repeat?.repeat_interval || ""); 
  const [repeatInterval, setRepeatInterval] = useState(props?.todo_repeat?.repeat_weekMonth||"TUAN");
  const [taskContent, setTaskContent] = useState(props?.task_content);
  const [location, setLocation] = useState(props?.location);
  const [selectedDays, setSelectedDays] = useState(()=>{
    const repeatDays = props?.todo_repeat?.repeat_days ?? [];
    if (typeof repeatDays ==='string'){
      return [repeatDays];
    }
    return Array.isArray(repeatDays)? repeatDays:[];
  });

  // console.log(props,selectedDays);

  const [err,setErrors] = useState({})
  const errors = {
    title:"",
    due_day:"",
    startTime:"",
    endTime:"",
    time:"",
    content:"",
    location:""
  }

  const validForm =()=>{
    setErrors({
      title: "",
      due_day: "",
      startTime: "",
      endTime: "",
      time: "",
      content: "",
      location: "",
      loop_day:""
    });
  
    if(!title.trim()) {
      setErrors(prev=>({...prev,title:"Tiêu đề không được để trống!!!!"}))
      return false;
    }
    if(!selectDate){
      setErrors(prev=>({...prev,due_day:"Ngày không được để trống!!!!"}))
      return false;
    }
    // if(formatDate(selectDate)<formatDate(new Date())){
    //   setErrors(prev=>({...prev,due_day:"Không được chọn ngày trong quá khứ!!!!"}))
    //   return false;
    // }
    if(!startTime){
      setErrors(prev=>({...prev,startTime:"Ngày bắt đầu không được để trống!!!!"}))
      return false;
    }
    if(!endTime){
      setErrors(prev=>({...prev,endTime:"Ngày kết thúc không được để trống!!!!"}))
      return false;
    }
    if(startTime>=endTime){
      setErrors(prev=>({...prev,time:"Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!!!!"}))
      return false;
    }
    if (repeat==="LAP_LAI" && selectedDays.length===0){
      setErrors(prev=>({...prev,loop_day:"Chọn ngày lặp lại !!!!"}))
      return false;
    }
    if(!taskContent.trim()) {
      setErrors(prev=>({...prev,content:"Nội dung không được để trống!!!!"}))
      return false;
    }
    if(!location.trim()) {
      setErrors(prev=>({...prev,location:"Địa chỉ không được để trống!!!!"}))
      return false;
    }
    return true
    
  }  

  const editEvent = (e) => {
    e.preventDefault();
    console.log(postData);
    
    if (validForm()===true){
    func(postData,props?.todo_id);
    }
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
  const daysArray = ["THU_HAI",
    "THU_BA",
    "THU_TU",
    "THU_NAM",
    "THU_SAU",
    "THU_BAY",
    "CHU_NHAT"];

  const toggleDay = (day) => {
    
    const dayValue = daysMap[day]
    setSelectedDays(prev=>(
      prev.includes(dayValue)? prev.filter(d=>d!==dayValue):[...prev,dayValue]
    )
    );
    
  };
  useEffect(()=>
    { 
      if (noEdit==="0"){

      
        if (repeat==="LAP_LAI"){
          if (selectDate!==""){
            // const dayKey = daysArray[selectDate.getDay()]
            // const dayValue = daysMap[dayKey]
            
            setRepeatFrequency(1);
            setRepeatInterval("TUAN");
          }
        }
        else{
          setSelectedDays([])
          setRepeatFrequency("");
          setRepeatInterval("");
        } 
      }
    },
      [repeat, selectDate,noEdit]
    );
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // console.log(props)
  
  const postData = {
    todo:{
        
        description:title,
        due_date:formatDate(selectDate),
        start_time:startTime+":00",
        end_time:endTime+":00",
        task_content:taskContent,
        location:location,
    },
    todoRepeat: repeat==="LAP_LAI" ? {
        repeat_option:repeat,
        repeat_days:selectedDays.sort((a, b) => daysArray.indexOf(a) - daysArray.indexOf(b)),
        repeat_weekMonth:repeatInterval,
        repeat_interval:repeatFrequency,
      }
      :
      {
        repeat_option:repeat
      }
    
  }
  const handleAbleEdit = () =>{
    setNoEdit("0");
  }
  const handleChangeTitle = (e) => {
    setTitle(e.target.value)
    setErrors({...errors,title:""})
  }
  const handleChangeContent = (e) => {
    setTaskContent(e.target.value)
    setErrors({...errors,content:""})
  }
  const handleChangeLocation = (e) => {
    setLocation(e.target.value)
    setErrors({...errors,location:""})
  }
  const handleChangeDate = (e) => {
    setDate(e)
    setErrors({...errors,due_day:""})
  }
  const handleChangeStartTime = (time) =>{
    setStartTime(time)
    setErrors({...errors,startTime:"",time:""})
  }
  const handleChangeEndTime = (time) =>{
    setEndTime(time)
    setErrors({...errors,endTime:"",time:""})
  }
  const handleChangeRepeat = (e) =>{
    setRepeat(e.target.value);
    setErrors({...errors,loop_day:""})
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
        {
            noEdit==="1"?
            (
                <img
                    src={editIcon}
                    className="add-event-icon"
                    alt="Edit"
                    onClick={handleAbleEdit}
                />
            )
            :
            (
                <img
                    src={saveIcon}
                    className="add-event-icon"
                    alt="Save"
                    onClick={editEvent}
                />
            )
            
        }
        
        <button></button>
        <div className="header-left">
          <div className="title-header">Chỉnh sửa sự kiện</div>
          <hr />
        </div>
        <div className="content">
          <div className="row-input">
            <div className="image-icon"></div>
            <div className="input-content required">
              <input type="text" className="input-title" placeholder="Thêm tiêu đề" 
              value={title} 
              required 
              onChange={handleChangeTitle}
              readOnly={noEdit==="1"}
              />
              {err.title  &&(
                <span className="error">{err.title}</span>
              )}
            </div>
          </div>
          
          <div className="row-input">
            <div className="image-icon">
              <img src={clockIcon} alt="" />
            </div>
            <div className="time-loop">
              <div className="input-time">
                <div className="input-date requried">
                  <DatePicker
                    selected={selectDate}
                    onChange={handleChangeDate}
                    dateFormat="yyyy-mm-dd"
                    locale={vi} // Tiếng Việt
                    placeholderText="Chọn ngày"
                    className="data-picker"
                    required
                    disabled={noEdit==="1"}
                  />
                  {selectDate && (
                    <span className="span">
                      {format(selectDate, "EEEE, dd MMMM", { locale: vi })}
                    </span>
                  )}
                  {err.due_day  &&(
                    <span className="error error-date">{err.due_day}</span>
                  )}
                </div>
              
                <div className="input-hour required">
                  <div className="required">
                  <TimePicker 
                    
                    onChange={handleChangeStartTime} 
                    value={startTime}
                    clearIcon={null} 
                    clockIcon={null} 
                    className="start-time-picker"
                    required
                    disabled={noEdit==="1"}
                  />
                  {err.startTime &&(
                    <span className="error error-hour">{err.startTime}</span>
                  )}
                  </div>
                  <span>-</span>
                  <div className="required">
                  <TimePicker 
                    
                    onChange={handleChangeEndTime} 
                    value={endTime}
                    clearIcon={null} 
                    clockIcon={null} 
                    className="end-time-picker"
                    required
                    disabled={noEdit==="1"}
                  />
                  {err.endTime &&(
                    <span className="error error-hour">{err.endTime}</span>
                  )}
                  </div>
                  {err.time  &&(
                    <span className="error error-time">{err.time}</span>
                  )}
                </div>
              </div>

              <div className="loop">
                <div className="loop-left">
                <select
                  className="select-repeat" 
                  value={repeat} 
                  onChange={
                    handleChangeRepeat
                  }
                  disabled={noEdit==="1"}
                  >
                  <option value="LAP_LAI">Lặp lại</option>
                  <option value="KHONG_LAP_LAI">Không lặp lại</option>
      
                </select>
                </div>
                <div className="loop-right">
                  <div className="days-loop required">
                    <label htmlFor="">Cứ lặp lại vào mỗi</label>
                    <div>
                    {Object.keys(daysMap).map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        disabled={repeat==="KHONG_LAP_LAI" ||noEdit==="1"}
                        style={{
                          width:'25px',
                          height:'25px',
                          margin: "5px",
                          padding: "2px",
                          borderRadius:"50%",
                          background: selectedDays.includes(daysMap[day] )? "#F5C3C8" : "#ccc",
                          color: selectedDays.includes(daysMap[day]) ? "#102C57" : "#000",
                          fontSize:'14px',
                          fontWeight:'550',
                          border:'none'
                        }}
                      >
                        {day}
                      </button>
                    ))}
                    </div>
                    { err.loop_day && (
                      <span className="error error-loop-day">{err.loop_day}</span>
                    )}

                  </div>
                  <div className="frep-loop">
                    <label htmlFor="">Cứ mỗi</label>
                    <input readOnly={noEdit==="1"} type="number" name="" id="" min={1} value={repeatFrequency} onChange={(e)=>setRepeatFrequency(e.target.value)} disabled={repeat==="KHONG_LAP_LAI"}/>
                    <div className="select-repeatWeekMonth" >
                      <select className="select-repeat-interval" name="time-loop" id="" value={repeatInterval} onChange={(e)=>setRepeatInterval(e.target.value)}
                      disabled={noEdit==="1"}
                        >
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
                onChange={handleChangeContent} 
                readOnly={noEdit==="1"}
                />
              {err.content  &&(
                    <span className="error error-text">{err.content}</span>
                  )}    
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
                onChange={handleChangeLocation} 
                readOnly={noEdit==="1"}
                />
              {err.location  &&(
                  <span className="error error-text">{err.location}</span>
              )}   

            </div>
          </div>
        </div>

        


      </div>
    </div>
  );
};

export default EditEvent;
