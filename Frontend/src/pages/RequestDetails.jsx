import { Button, isMuiElement } from "@mui/material";
import React from "react";
import deleteIcon from "../assets/icons/delete.png";
import "./RequestDetails.scss";

export const RequestDetails = ({ item, onClose, onCloseandUpdate }) => {
  if (!item) return null;
  console.log(item);
  const statusColors = {
    COMPLETED: "rgba(6, 95, 70, 0.5)",
    REJECTED: "rgba(185, 28, 28, 0.5)",
    PENDING: "rgba(30, 64, 175, 0.5)",
    ACCEPTED: "rgba(146, 64, 14, 0.5)",
  };
  const translateStatus = (status) => {
    const statusMap = {
      COMPLETED: "Hoàn thành",
      REJECTED: "Hủy",
      ACCEPTED: "Đã chấp nhận",
      PENDING: "Chờ xử lý",
    };
    return statusMap[status] || "Không xác định";
  };
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN") + "đ";
  };
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
            <p>Yêu cầu: {item.request || "Không có yêu cầu"}</p>
            <br />
            <p>
              Ghi chú:{" "}
              {item.notes
                .replace(/<\/?[^>]+>/g, ", ") // Thay thế tất cả các thẻ HTML bằng ", "
                .replace(/,\s*,/g, ", ") // Xóa các dấu ", " thừa liên tiếp
                .replace(/(^[, ]+|[, ]+$)/g, "") || "Không có ghi chú"}{" "}
            </p>
          </p>

          <div className="time-picker-section">
            <div className="label">Thời gian bắt đầu: {item.timejob}</div>
          </div>

          <div className="status-section">
            <div className="price">
              Thành tiền:{" "}
              {formatCurrency(
                Math.round(
                  (parseInt(item.hours) + parseInt(item.minutes) / 60) *
                  item.price
                )
              )}
            </div>
            <div className="status">
              Trạng thái:{" "}
              <span
                className="status-label"
                style={{
                  backgroundColor: statusColors[item.status],
                  color: statusColors[item.status].replace("0.5)", "1)"),
                  padding: "4px 6px",
                  borderRadius: "4px",
                }}
              >
                {translateStatus(item.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="footer">
          {item.status === "COMPLETED" || item.status === "REJECTED" ? (
            <Button
              variant="contained"
              className="complete-button"
              onClick={onClose}
            >
              Đóng
            </Button>
          ) : item.status === "PENDING" ? (
            <>
              <Button
                variant="contained"
                className="reject-button"
                onClick={() => onCloseandUpdate(item, "REJECTED")}
              >
                Từ chối
              </Button>
              <Button
                variant="contained"
                className="accept-button"
                onClick={() => onCloseandUpdate(item, "ACCEPTED")}
              >
                Tiếp nhận
              </Button>
            </>
          ) : item.status === "ACCEPTED" ? (
            <>
              <Button
                variant="contained"
                className="reject-button"
                onClick={() => onCloseandUpdate(item, "REJECTED")}
              >
                Huỷ
              </Button>
              <Button
                variant="contained"
                className="accept-button"
                onClick={() => onCloseandUpdate(item, "COMPLETED")}
              >
                Hoàn thành
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              className="complete-button"
              onClick={() => onCloseandUpdate(item, "COMPLETED")}
            >
              Hoàn thành
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
