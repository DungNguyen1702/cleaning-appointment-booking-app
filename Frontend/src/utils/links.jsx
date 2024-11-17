import React from "react";

import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const links = [
  // users
  { text: "Lịch", path: "calendar", icon: <FaWpforms />, roles: "CUSTOMER" },
  {
    text: "Công ty dọn dẹp",
    path: "company",
    icon: <MdQueryStats />,
    roles: "CUSTOMER",
  },
  {
    text: "Lịch sử",
    path: "history",
    icon: <IoBarChartSharp />,
    roles: "CUSTOMER",
  },
  {
    text: "Thông tin cá nhân",
    path: "profile",
    icon: <ImProfile />,
    roles: "CUSTOMER",
  },
  {
    text: "Đăng xuất",
    path: "logout",
    icon: <LogoutOutlinedIcon />,
    roles: "CUSTOMER",
  },

  // company

  {
    text: "Thông tin công ty",
    path: "details",
    icon: <MdQueryStats />,
    roles: "COMPANY",
  },
  {
    text: "Lịch làm việc",
    path: "calendar",
    icon: <FaWpforms />,
    roles: "COMPANY",
  },
  {
    text: "Lịch sử",
    path: "history",
    icon: <IoBarChartSharp />,
    roles: "COMPANY",
  },
  {
    text: "Đăng xuất",
    path: "logout",
    icon: <LogoutOutlinedIcon />,
    roles: "COMPANY",
  },
];

export default links;
