import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AccountContext";
import { useEffect } from "react";
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  Schedule,
  Profile,
  Logout,
  CleaningCompany,
  History,
  DetailCompany,
  AppointmentForm,
  Com_Calendar,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      { // để path ở đây để nó chạy thử
        path: "calendar",
        element: <Com_Calendar />,
      },

      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Schedule />,
          },
          {
            path: "company",
            element: <CleaningCompany />,
          },
          {
            path: "history",
            element: <History />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "logout",
            element: <Logout />,
          },
          {
            path: "company/:companyId",            
            element: <DetailCompany />,
          },
          {
            path: "appointmentform",
            element: <AppointmentForm />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  useEffect(() => {
    // Setup local storage

    if (!localStorage.getItem("access_token")) {
      localStorage.removeItem("access_token");
    }
    if (!localStorage.getItem("user_info")) {
      localStorage.removeItem("user_info");
    }
  }, []);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};
export default App;
