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
import { ListRequest } from "./pages/ListRequest";
import useAuth from "./hooks/useAuth";

export const AdminRoute = () => {
  const { account } = useAuth();

  if (account && account.role === 2) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export const CompanyRoute = () => {
  const { account } = useAuth();

  if (account && account.role === 1) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export const UserRoute = () => {
  const { account } = useAuth();

  if (account && account.role === 0) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ListRequest />,
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
        // element: <UserRoute />,
        // children: [
        //   {
        //     path: "user",
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
            element: <ListRequest />,
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
        //   },
        // ],
      },

      // {
      //   element: <CompanyRoute />,
      //   children: [
      //     {
      //       path: "company",
      //       element: <DashboardLayout />,
      //       children: [
      //         {
      //           path: "history",
      //           element: <ListRequest />,
      //         },
      //       ],
      //     },
      //   ],
      // },
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
