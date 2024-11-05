import { Button } from "@mui/material";
import React from "react";
import deleteIcon from "../assets/icons/delete.png";
import "./RequestDetails.scss";

export const RequestDetails = ({ item, onClose }) => {
  if (!item) return null;
  
  return (
    <div className="company-modal-hon">
      <div className="modal-container">
        <div className="header">
          <div className="title">Thông tin đặt lịch</div>
          <img
            src={deleteIcon}
            className="delete-icon"
            alt="Delete"
            onClick={onClose}
          />
        </div>

        <div className="content">
          <p className="info">
            <p>Tên: {item.name}</p>
            <br />
            <p>Số điện thoại: {item.phone}</p>
            <br />
            <p>Ngày đặt lịch: {item.request_date}</p>
            <br />
            <p>Địa chỉ: {item.address || "Địa chỉ không xác định"}</p>
            <br />
            <p>Yêu cầu: {item.requirements || "Không có yêu cầu"}</p>
            <br />
            <p>Ghi chú: {item.notes || "Không có ghi chú"}</p>
          </p>

          <div className="time-picker-section">
            <div className="label">Thời gian làm:</div>
            <div className="time-picker">
              <div className="time">{item.timeHours || "00"}</div>
              <div className="separator">:</div>
              <div className="time">{item.timeMinutes || "00"}</div>
            </div>
          </div>

          <div className="status-section">
            <div className="price">
              Thành tiền: {(item.workingHours * item.price).toLocaleString()}đ
            </div>
            <div className="working-hours">
              Số giờ làm: {item.workingHours} giờ {/* Hiển thị số giờ làm */}
            </div>
            <div className="status">
              Trạng thái: <span className="status-label">{item.status}</span>
            </div>
          </div>
        </div>
        
        <div className="footer">
          <Button
            variant="contained"
            className="complete-button"
            onClick={onClose}
          >
            Hoàn thành
          </Button>
        </div>
      </div>
    </div>
  );
};  
