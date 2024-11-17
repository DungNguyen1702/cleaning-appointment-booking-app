import React, { useRef, useState, useEffect } from "react";
import companylogo from "../assets/images/company-logo.png";
import ReactQuill from "react-quill";
import Parser from "html-react-parser";
import "./CompanyDetails.scss";

const AutoResizeTextarea = ({ value, onChange }) => {
  const textareaRef = useRef(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e) => {
    setHeight("auto");
    onChange(e);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      style={{
        height,
        resize: "none",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    />
  );
};

const Toggle = ({ checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={handleChange} />
      <span className="slider round"></span>
    </label>
  );
};

export const CompanyDetails = () => {
  const companyData = {
    name: "X Factor",
    email: "xfactor@gmail.com",
    phone: "0910102024",
    introduction: `
    Chuyên cung cấp các dịch vụ vệ sinh nhà cửa quanh khu vực Đà nẵng. Đảm bảo sạch sẽ, thơm tho mang lại cảm giác thoải mái cho người dùng.
  `,
    services: [
      "Lau chùi nhà cửa bao gồm tất cả dịch vụ lau chùi các thiết bị trong nhà.",
      "Hỗ trợ bàn giặt ủi và phơi đồ tại nhà.",
      "Hỗ trợ đi chợ giúp gia chủ.",
    ],
    hours: {
      sunday: { isOpen: false, start: "", end: "" },
      monday: { isOpen: true, start: "09:00", end: "17:00" },
      tuesday: { isOpen: true, start: "09:00", end: "17:00" },
      wednesday: { isOpen: true, start: "09:00", end: "17:00" },
      thursday: { isOpen: true, start: "09:00", end: "17:00" },
      friday: { isOpen: true, start: "09:00", end: "17:00" },
      saturday: { isOpen: false, start: "", end: "" },
    },
  };
  const [company, setCompany] = useState(companyData);
  const [quillValue, setQuillValue] = useState("");
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Convert the services array into a formatted <ul> list
    const updatedQuillValue = `<ul>${company.services
      .map((service) => `<li>${service.trim()}</li>`)
      .join("")}</ul>`;
    setQuillValue(updatedQuillValue);
  }, [company.services]);

  const handleSave = () => {
    const newServices = quillValue
      .match(/<li>(.*?)<\/li>/g)
      .map((item) => item.replace(/<\/?li>/g, ""));
    setCompany((prev) => ({ ...prev, services: newServices }));
    console.log("Saved:", newServices);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const modules = {
    toolbar: false, // Ẩn toolbar để người dùng không thể thêm các định dạng khác
  };

  return (
    <div className="company-profile">
      <div className="main-content">
        <div className="header">
          <h1>Thông tin công ty</h1>
        </div>
        <div className="profile-section">
          <div className="profile-picture-section">
            <div className="profile-picture-title">
              <img
                className="profile-picture"
                alt="Company Logo"
                src={company.logo || companylogo}
              />
              <h4 className="company-name-title">{company.name}</h4>
            </div>
            <button
              className="choose-image-button"
              onClick={() => fileInputRef.current.click()}
            >
              Chọn ảnh
            </button>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <div className="company-details">
            <div className="company-info">
              <div className="company-name">
                <label htmlFor="company-name">Công ty</label>
                <input
                  id="company-name"
                  type="text"
                  value={company.name}
                  onChange={(e) =>
                    setCompany((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="email-info">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={company.email}
                  onChange={(e) =>
                    setCompany((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div className="phone-info">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  type="text"
                  value={company.phone}
                  onChange={(e) =>
                    setCompany((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="description-section">
              <div className="introduction">
                <h2>Giới thiệu:</h2>
                <AutoResizeTextarea
                  value={company.introduction}
                  onChange={(e) =>
                    setCompany((prev) => ({
                      ...prev,
                      introduction: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="services">
                <h2>Dịch vụ :</h2>
                <ReactQuill
                  ref={quillRef}
                  value={quillValue}
                  modules={modules}
                  style={{
                    resize: "none",
                    overflow: "hidden",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hours-section">
          <h2>Set Standard Hours</h2>
          <div className="hours-form">
            {Object.keys(company.hours).map((day) => (
              <div className="day" key={day}>
                <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                <Toggle
                  checked={company.hours[day].isOpen}
                  onChange={(isOpen) =>
                    setCompany((prev) => ({
                      ...prev,
                      hours: {
                        ...prev.hours,
                        [day]: { ...prev.hours[day], isOpen },
                      },
                    }))
                  }
                />
                {company.hours[day].isOpen && (
                  <>
                    <input
                      type="time"
                      value={company.hours[day].start}
                      onChange={(e) =>
                        setCompany((prev) => ({
                          ...prev,
                          hours: {
                            ...prev.hours,
                            [day]: {
                              ...prev.hours[day],
                              start: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                    <input
                      type="time"
                      value={company.hours[day].end}
                      onChange={(e) =>
                        setCompany((prev) => ({
                          ...prev,
                          hours: {
                            ...prev.hours,
                            [day]: { ...prev.hours[day], end: e.target.value },
                          },
                        }))
                      }
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="save-button-section">
          <button className="save-button" onClick={handleSave}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
