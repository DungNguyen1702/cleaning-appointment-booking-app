import React from "react";

import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const links = [
  // users
  { text: "Lịch trình", path: ".", icon: <FaWpforms />, roles: 0 },
  {
    text: "Công ty dọn dẹp",
    path: "company",
    icon: <MdQueryStats />,
    roles: 0,
  },
  { text: "Lịch sử", path: "history", icon: <IoBarChartSharp />, roles: 0 },
  { text: "Thông tin cá nhân", path: "profile", icon: <ImProfile />, roles: 0 },
  { text: "Đăng xuất", path: "logout", icon: <LogoutOutlinedIcon />, roles: 0 },

  // admin
  { text: "Trang chủ", path: ".", icon: <FaWpforms />, roles: 1 },
  {
    text: "Thông tin công ty",
    path: "company",
    icon: <MdQueryStats />,
    roles: 1,
  },
  { text: "Lịch sử", path: "history", icon: <IoBarChartSharp />, roles: 0 },
  { text: "Đăng xuất", path: "logout", icon: <LogoutOutlinedIcon />, roles: 0 },
];

export default links;
