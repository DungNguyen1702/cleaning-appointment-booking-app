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
            <p>Ngày đặt lịch: {item.date}</p>
            <br />
            <p>Địa chỉ: 123 Nguyễn Tri Phương, Thạc Gián, Thanh Khê, Đà Nẵng</p>
            <br />
            <p>Yêu cầu: Lau nhà, kính,...</p>
            <br />
            <p>
              {" "}
              Ghi chú: Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Expedita, eligendi magnam. Perferendis itaque nesciunt
              consequuntur vitae accusamus, laudantium ex magnam odio eligendi
              molestiae dignissimos at laboriosam, mollitia impedit quaerat.
              Quis?
            </p>
          </p>

          <div className="time-picker-section">
            <div className="label">Thời gian làm:</div>
            <div className="time-picker">
              <div className="time">02</div>
              <div className="separator">:</div>
              <div className="time">32</div>
            </div>
          </div>

          <div className="status-section">
            <div className="price">
              Thành tiền: {(item.hours * item.price).toLocaleString()}đ
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
