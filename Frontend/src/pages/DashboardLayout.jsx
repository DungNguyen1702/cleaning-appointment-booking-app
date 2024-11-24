import { Outlet } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { Navbar, BigSidebar, SmallSidebar } from "../components";
import { useState, createContext, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
const DashboardContext = createContext();

const DashboardLayout = () => {
  // temp
  const navigate = useNavigate();

  const storedUserInfo = localStorage.getItem("user_info");
  const user1 = storedUserInfo ? JSON.parse(storedUserInfo)?.name : "";
  const user = { name: user1 };
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div style={{ position: "relative" }} className="dashboard-page">
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
