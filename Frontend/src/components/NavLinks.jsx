import { Logout } from "../pages";
import { useDashboardContext } from "../pages/DashboardLayout";
import links from "../utils/links";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const NavLinks = ({ isBigSidebar = false }) => {
  const { user, toggleSidebar } = useDashboardContext();
  const { account } = useAuth();
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, icon, roles } = link;
        if (account && account.role === roles) {
          return (
            <NavLink
              to={path}
              key={text}
              onClick={isBigSidebar ? null : toggleSidebar}
              className="nav-link"
              end
            >
              <span className="icon">{icon}</span>
              {text}
            </NavLink>
          );
        }
        return null;
      })}
    </div>
  );
};

export default NavLinks;
