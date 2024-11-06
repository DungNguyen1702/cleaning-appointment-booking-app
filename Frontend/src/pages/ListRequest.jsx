import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { RequestDetails } from "./RequestDetails";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import avatar1 from "../assets/images/avatar-1.jpg";
import "./ListRequest.scss";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RequestAPI from "../api/requestAPI";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../components/loading_overlay";

const statusOptions = [
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Hủy", value: "REJECTED" },
  { label: "Đã chấp nhận", value: "ACCEPTED" },
  { label: "Chờ xử lý", value: "PENDING" },
];

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

export const ListRequest = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const companyInfo = JSON.parse(localStorage.getItem("user_info"));
  const companyId = companyInfo?.company_id;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await RequestAPI.getCompanyRequests(
          companyId,
          currentPage,
          8
        );
        console.log(response);
        const translatedData = response.data.requests.map((item) => ({
          ...item,
          hours: Math.floor(item.workingHours),
          minutes: Math.round(
            (item.workingHours - Math.floor(item.workingHours)) * 60
          ),
          total: parseFloat(item.workingHours) * item.price,
        }));
        setData(translatedData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchRequests();
    }
  }, [companyId, currentPage]);

  const validateWorkingHours = (hours, minutes) => {
    return hours >= 1 || minutes >= 1;
  };

  const updateRequestStatus = async (id, status, workingHours, timeMinutes) => {
    try {
      setLoading(true);
      const hourWorks = parseInt(workingHours) + parseInt(timeMinutes) / 60;
      await RequestAPI.updateStatusRQByCompany(id, parseInt(hourWorks), status);
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Failed to update request status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, value) => {
    const item = data.find((item) => item.request_id === id);
    if (value === "COMPLETED") {
      if (!validateWorkingHours(item.hours, item.minutes)) {
        toast.warning("Số giờ hoặc số phút phải lớn hơn 0 để hoàn thành.");
        return;
      }
    }

    setData((prevData) =>
      prevData.map((item) =>
        item.request_id === id ? { ...item, status: value } : item
      )
    );

    updateRequestStatus(id, value, item.hours, item.minutes);
  };

  const handleHoursChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.request_id === id ? { ...item, hours: Math.max(0, value) } : item
      )
    );
  };

  const handleMinutesChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.request_id === id ? { ...item, minutes: Math.max(0, value) } : item
      )
    );
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeandUpdate = (items, stt) => {
    if (
      stt === "COMPLETED" &&
      !validateWorkingHours(items.hours, items.minutes)
    ) {
      toast.warning("Số giờ hoặc số phút phải lớn hơn 0 để hoàn thành.");
      return;
    }
    setData((prevData) =>
      prevData.map((item) =>
        item.request_id === items.request_id ? { ...item, status: stt } : item
      )
    );

    updateRequestStatus(items.request_id, stt, items.hours, items.minutes);

    closeModal();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Filtered data based on search term
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN") + "đ";
  };
  return (
    <>
      <ToastContainer />
      <h1 className="title-history">Lịch sử</h1>
      <div className="main">
        <div className="background-shadow">
          <div className="overlap">
            <div className="background">
              <div className="overlap-group">
                <input
                  className="input"
                  type="text"
                  placeholder="Tìm khách hàng..."
                  aria-label="Search customer"
                  value={searchTerm} // Controlled input
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                />

                <div className="header-row">
                  <div className="cell-sub account">Khách hàng</div>
                  <div className="cell-sub phone">Số điện thoại</div>
                  <div className="cell-sub date">Ngày đặt</div>
                  <div className="cell-sub hour">Số giờ làm</div>
                  <div className="cell-sub cost">Giá</div>
                  <div className="cell-sub total-cost">Tổng tiền</div>
                  <div className="cell-sub statusrq">Trạng thái</div>
                </div>
              </div>

              <div className="table-body">
                {loading ? (
                  <LoadingOverlay loading={loading} />
                ) : (
                  filteredData.map((item) => (
                    <div
                      className="row"
                      key={item.request_id}
                      onClick={() => openModal(item)}
                    >
                      <div className="cell account">
                        <img className="avatar" alt={item.name} src={avatar1} />
                        {item.name}
                      </div>
                      <div className="cell phone">{item.phone}</div>
                      <div className="cell date">{item.request_date}</div>
                      <div className="cell hour">
                        <div
                          className="time-picker"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="number"
                            min="0"
                            value={item.hours}
                            onChange={(e) => {
                              if (
                                item.status !== "COMPLETED" &&
                                item.status !== "REJECTED"
                              ) {
                                handleHoursChange(
                                  item.request_id,
                                  parseInt(e.target.value)
                                );
                              }
                            }}
                            disabled={
                              item.status === "COMPLETED" ||
                              item.status === "REJECTED"
                            }
                          />
                          <div className="separator">:</div>
                          <input
                            type="number"
                            min="0"
                            value={item.minutes}
                            onChange={(e) => {
                              if (
                                item.status !== "COMPLETED" &&
                                item.status !== "REJECTED"
                              ) {
                                handleMinutesChange(
                                  item.request_id,
                                  parseInt(e.target.value)
                                );
                              }
                            }}
                            disabled={
                              item.status === "COMPLETED" ||
                              item.status === "REJECTED"
                            }
                          />
                        </div>
                      </div>
                      <div className="cell cost">
                        {parseFloat(item.price).toLocaleString()}đ
                      </div>
                      <div className="cell total-price">
                        {formatCurrency(
                          Math.round(
                            (parseInt(item.hours) +
                              parseInt(item.minutes) / 60) *
                              item.price
                          )
                        )}
                      </div>
                      <div
                        className="cell status"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.status === "COMPLETED" ||
                        item.status === "REJECTED" ? (
                          <span
                            style={{
                              backgroundColor: statusColors[item.status],
                              color: statusColors[item.status].replace(
                                "0.5)",
                                "1)"
                              ),
                              padding: "8px 16px",
                              borderRadius: "4px",
                              maxWidth: "86px",
                              minWidth: "116px",
                            }}
                          >
                            {translateStatus(item.status)}
                          </span>
                        ) : (
                          <Select
                            value={item.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              if (
                                item.status === "ACCEPTED" &&
                                e.target.value === "PENDING"
                              ) {
                                return;
                              }
                              handleStatusChange(
                                item.request_id,
                                e.target.value
                              );
                            }}
                            sx={{
                              "& .MuiSelect-select": {
                                backgroundColor: statusColors[item.status],
                                color: statusColors[item.status].replace(
                                  "0.5)",
                                  "1)"
                                ),
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                maxWidth: "86px",
                                minWidth: "82px",
                                textAlign: "center",
                                paddingRight: "16px !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                              "& .MuiSvgIcon-root": {
                                display: "none",
                              },
                            }}
                          >
                            {statusOptions.map((option) => (
                              <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                  backgroundColor: statusColors[option.value],
                                  color: statusColors[option.value].replace(
                                    "0.5)",
                                    "1)"
                                  ),
                                  "&:hover": {
                                    backgroundColor: statusColors[option.value],
                                  },
                                }}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pagination-wrapper">
          <Pagination
            shape="rounded"
            size="medium"
            variant="outlined"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Request Details"
        style={{
          content: {
            width: "50%",
            height: "auto",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <RequestDetails
          item={selectedItem}
          onClose={closeModal}
          onCloseandUpdate={closeandUpdate}
        />
      </Modal>
    </>
  );
};
