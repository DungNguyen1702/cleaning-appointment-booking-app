import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { RequestDetails } from "./RequestDetails";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import avatar1 from "../assets/images/avatar-1.jpg";
import "./ListRequest.scss";
import RequestAPI from "../api/requestAPI";

const statusOptions = [
  "Hoàn thành",
  "Hủy",
  "Đang xử lý",
  "Chờ xử lý",
  "Không xác định",
];

const statusColors = {
  "Hoàn thành": "#065f46",
  Hủy: "#b91c1c",
  "Đang xử lý": "#92400e",
  "Chờ xử lý": "#1e40af",
  "Không xác định": "gray",
};

const translateStatus = (status) => {
  const statusMap = {
    COMPLETED: "Hoàn thành",
    CANCELLED: "Hủy",
    PROCESSING: "Đang xử lý",
    PENDING: "Chờ xử lý",
    UNKNOWN: "Không xác định",
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
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const companyInfo = JSON.parse(localStorage.getItem("user_info"));
  const companyId = companyInfo?.company_id;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await RequestAPI.getCompanyRequests(companyId, currentPage, 10);
        const translatedData = response.data.requests.map((item) => ({
          ...item,
          status: translateStatus(item.status),
          total: item.workingHours * item.price,
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

  const handleStatusChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.request_id === id ? { ...item, status: value } : item
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Filtered data based on search term
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
                  <div className="cell-sub status">Trạng thái</div>
                </div>
              </div>

              <div className="table-body">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  filteredData.map((item) => (
                    <div
                      className="row"
                      key={item.request_id}
                      onClick={() => openModal(item)}
                    >
                      <div className="cell account">
                        <img
                          className="avatar"
                          alt={item.name}
                          src={avatar1}
                        />
                        {item.name}
                      </div>
                      <div className="cell phone">{item.phone}</div>
                      <div className="cell date">{item.request_date}</div>
                      <div className="cell hour">{item.workingHours}</div> {/* Hiển thị workingHours */}
                      <div className="cell price">
                        {item.price.toLocaleString()}đ
                      </div>
                      <div className="cell total-price">
                        {item.total.toLocaleString()}đ
                      </div>
                      <div
                        className="cell status"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Select
                          value={item.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(item.request_id, e.target.value);
                          }}
                          sx={{
                            "& .MuiSelect-select": {
                              backgroundColor: statusColors[item.status],
                              color: "white",
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
                              key={option}
                              value={option}
                              sx={{
                                backgroundColor: statusColors[option],
                                color: "white",
                                "&:hover": {
                                  backgroundColor: statusColors[option],
                                },
                              }}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
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
        <RequestDetails item={selectedItem} onClose={closeModal} />
      </Modal>
    </>
  );
};
