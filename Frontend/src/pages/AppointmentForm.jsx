import React, { useState, useEffect } from "react";
import "./AppointmentForm.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "../components/loading_overlay";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import RequestAPI from "../api/requestAPI";
const AppointmentForm = () => {
  const storedUserInfo = localStorage.getItem("user_info");
  const user_id = storedUserInfo ? JSON.parse(storedUserInfo)?.user_id : "";

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const c_id = queryParams.get("companyId") ? queryParams.get("companyId") : "";

  const [minDateTime, setMinDateTime] = useState("");

  const [textError, setTextError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 7);
    now.setMinutes(now.getMinutes() + 30);
    const formattedDateTime = now.toISOString().slice(0, 16);
    setMinDateTime(formattedDateTime);

    if (c_id == "") {
      toast.warning("Hãy truyền vào ID company'", {
        position: "top-right",
      });
      console.log("Hãy truyền vào ID company");
    }
  }, [c_id]);

  const [formData, setFormData] = useState(
    localStorage.getItem("formData")
      ? JSON.parse(localStorage.getItem("formData"))
      : {
          workContent: "",
          notes: "",
          time: "",
          name: "",
          phoneNumber: "",
          location: "",
        }
  );

  const fetchRequest = async (formData) => {
    try {
      setLoading(true);
      const res = await RequestAPI.createRequest(formData);
      const status = res.status;
      if (status === 201) {
        toast.success("Tạo cuộc hẹn thành công", {
          position: "top-right",
        });
        localStorage.removeItem("formData");
      }
      console.log(res);
    } catch (error) {
      console.error("Error fetch create request : ", error);
      toast.error("Tạo cuộc hẹn không thành công", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    localStorage.setItem(
      "formData",
      JSON.stringify({ ...formData, [name]: value })
    );
    if (name === "phoneNumber") setTextError("");
  };

  const handleNotesChange = (html) => {
    setFormData({ ...formData, notes: html });
    localStorage.setItem(
      "formData",
      JSON.stringify({ ...formData, notes: html })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setTextError("Please enter a valid phone number (9 or 10 digits).");
      return;
    } // check phoneNumber
    //convert formData to format body post api

    if (c_id == "") {
      toast.warning("Hãy truyền vào ID company'", {
        position: "top-right",
      });
      console.log("Hãy truyền vào ID company");
      return;
    } //check company id trước khi post
    const postData = {
      user_id: user_id,
      company_id: c_id,

      name: formData.name,
      phone: formData.phoneNumber,
      address: formData.location,
      request_date: formData.time.split("T")[0],
      timejob: formData.time.replace("T", " ") + ":00",
      status: "PENDING",
      price: 100000,
      notes: formData.notes,
      request: formData.workContent,
    };

    console.log(formData);
    console.log(postData);
    fetchRequest(postData);
  };

  return (
    <div>
      <h3 className="h3-header">Đặt lịch</h3>

      <ToastContainer />

      <div className="appointment-form">
        <LoadingOverlay loading={loading} />
        <form onSubmit={handleSubmit}>
          {/* Left Side - Time, Name, Phone, Address */}
          <div className="form-left">
            <div className="form-group">
              <label htmlFor="workContent">Nội dung công việc</label>
              <textarea
                id="workContent"
                name="workContent"
                value={formData.workContent}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Ghi chú</label>
              {/* thay tool bar và texteara note bằng reactquill*/}
              <ReactQuill
                className="react-quill"
                id="notes"
                theme="snow"
                value={formData.notes}
                onChange={handleNotesChange}
              />
            </div>
          </div>

          {/* Right Side - Work Content, Notes */}
          <div className="form-right">
            <div className="form-group-right">
              <label htmlFor="time">Thời gian</label>
              <input
                type="datetime-local"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-control-right"
                min={minDateTime}
                required
              />
            </div>

            <div className="form-group-right">
              <label htmlFor="name">Tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control-right"
                required
              />
            </div>

            <div className="form-group-right">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="form-control-right"
                required
              />
              {textError && (
                <p style={{ color: "red" }} className="error-text">
                  {textError}
                </p>
              )}
            </div>

            <div className="form-group-right">
              <label htmlFor="location">Địa chỉ</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control-right"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Tạo lịch hẹn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
