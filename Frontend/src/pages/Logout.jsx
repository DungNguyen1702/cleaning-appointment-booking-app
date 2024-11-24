import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const logoutUser = async () => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  useEffect(() => {
    logoutUser();
  }, [navigate]);

  return null; // Không render gì cả
};

export default Logout;
