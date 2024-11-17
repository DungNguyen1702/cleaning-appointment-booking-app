import {
  RouterProvider,
  createBrowserRouter,
  BrowserRouter,
} from "react-router-dom";
import { Outlet, Navigate } from "react-router-dom";
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
import { ListRequest } from "./pages/ListRequest";
import useAuth from "./hooks/useAuth";
import { CompanyDetails } from "./pages/CompanyDetails";

export const AdminRoute = () => {
  const { account } = useAuth();

  if (account && account.role === "ADMIN") {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export const CompanyRoute = () => {
  const { account } = useAuth();
  console.log(account);
  console.log(account.role);
  if (account && account.role === "COMPANY") {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export const UserRoute = () => {
  const { account } = useAuth();
  console.log(account);
  console.log(account.role);
  if (account && account.role === "CUSTOMER") {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

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

      {
        element: <UserRoute />,
        children: [
          {
            path: "user",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                path: "calendar",
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

      {
        element: <CompanyRoute />,
        children: [
          {
            path: "company",
            element: <DashboardLayout />,
            children: [
              {
                path: "details",
                element: <CompanyDetails />,
              },
              {
                path: "history",
                element: <ListRequest />,
              },
              {
                path: "calendar",
                element: <Com_Calendar />,
              },
            ],
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
