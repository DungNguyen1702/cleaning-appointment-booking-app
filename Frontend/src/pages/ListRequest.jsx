import React, { useState } from "react";
import Modal from "react-modal";
import { RequestDetails } from "./RequestDetails";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import avatar1 from "../assets/images/avatar-1.jpg";
import "./ListRequest.scss";

// Fake data
const fakeData = [
  {
    id: 1,
    name: "Harold Gonzalez",
    phone: "937-330-1634",
    date: "03/24/2023",
    hours: 1,
    price: 200000,
    status: "Hoàn thành",
    avatar: avatar1,
  },
  {
    id: 2,
    name: "Anthony Anderson",
    phone: "828-216-2190",
    date: "04/09/2023",
    hours: 1,
    price: 900000,
    status: "Hủy",
    avatar: avatar1,
  },
  {
    id: 3,
    name: "Gary Faulkner",
    phone: "215-302-3276",
    date: "03/24/2023",
    hours: 1,
    price: 2000000,
    status: "Hoàn thành",
    avatar: avatar1,
  },
  {
    id: 4,
    name: "Steve Nelson",
    phone: "937-330-1634",
    date: "05/06/2023",
    hours: 1,
    price: 120000,
    status: "Chờ xử lý",
    avatar: avatar1,
  },
  {
    id: 5,
    name: "Kimberly Sullivan",
    phone: "937-330-1634",
    date: "06/19/2023",
    hours: 1,
    price: 320000,
    status: "Đang xử lý",
    avatar: avatar1,
  },
  {
    id: 6,
    name: "Susan Pugh",
    phone: "937-330-1634",
    date: "06/30/2023",
    hours: 1,
    price: 890000,
    status: "Hoàn thành",
    avatar: avatar1,
  },
];

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

export const ListRequest = () => {
  const [data, setData] = useState(
    fakeData.map((item) => ({
      ...item,
      status: item.status || "Không xác định", // Đặt giá trị mặc định là "Không xác định" nếu không có giá trị
    }))
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleStatusChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: value,
              hours: value === "Hoàn thành" ? 1 : item.hours,
            }
          : item
      )
    );
  };

  const handleHoursChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, hours: Math.max(1, value) } : item
      )
    );
  };

  const handleHoursIncrement = (event, id) => {
    event.stopPropagation();
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, hours: item.hours + 1 } : item
      )
    );
  };

  const handleHoursDecrement = (event, id) => {
    event.stopPropagation();
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, hours: Math.max(1, item.hours - 1) } : item
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
                {data.map((item) => (
                  <div
                    className="row"
                    key={item.id}
                    onClick={() => openModal(item)}
                  >
                    <div className="cell account">
                      <img
                        className="avatar"
                        alt={item.name}
                        src={item.avatar}
                      />
                      {item.name}
                    </div>
                    <div className="cell phone">{item.phone}</div>
                    <div className="cell date">{item.date}</div>
                    <div className="cell hour">
                      <div className="quantity-control">
                        <button
                          onClick={(event) =>
                            handleHoursDecrement(event, item.id)
                          }
                        >
                          <RemoveIcon />
                        </button>
                        <span>{item.hours}</span>
                        <button
                          onClick={(event) =>
                            handleHoursIncrement(event, item.id)
                          }
                        >
                          <AddIcon />
                        </button>
                      </div>
                    </div>
                    <div className="cell price">
                      {item.price.toLocaleString()}đ
                    </div>
                    <div className="cell total-price">
                      {(item.hours * item.price).toLocaleString()}đ
                    </div>
                    <div
                      className="cell status"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={item.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item.id, e.target.value);
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
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pagination-wrapper">
          <Pagination
            componentName="Pagination"
            shape="rounded"
            size="medium"
            variant="outlined"
            count="6"
            //   page={currentPage}
            //   onChange={handleChange}
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
