//Default import statements
import { createBrowserRouter } from "react-router-dom";

// Importing the components
import Error from "../components/pages/Error.tsx";
import Home from "../components/pages/Home.tsx";

// Navirai Pages
import Historia from "../components/pages/navirai/Historia.tsx";
import Investir from "../components/pages/navirai/Investir.tsx";
// Onde Dormir Pages
import Hoteis from "../components/pages/ondeDormir/hoteis/Hoteis.tsx";
import HotelInfo from "../components/pages/ondeDormir/hoteis/HotelInfo.tsx";

// Login Page
import Login from "../components/pages/Login.tsx";

// Middlewares
import ProtectedRoute from "../components/middleware/ProtectedRoute.tsx";
import PublicRoute from "../components/middleware/PublicRoute.tsx";

// Admin Interface
import Dashboard from "../components/admin/Dashboard.tsx";
import CadHotel from "../components/admin/CadHotel.tsx";
import CadEvento from "../components/admin/CadEvento.tsx";
import UserManagement from "../components/admin/UserManagement.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />
  },
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "login",
        element: <Login />
      }
    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "hoteis/novo",
            element: <CadHotel />
          },
          {
            path: "eventos/novo",
            element: <CadEvento />
          },
          {
            path: "usuarios",
            element: <UserManagement />
          }
        ]
      }
    ]
  },
  {
    path: "/hoteis",
    element: <Hoteis />,
    children: [
      {
        path: ":id",
        element: <HotelInfo />
      }
    ]
  },
  {
    path: "/historia",
    element: <Historia />
  },
  {
    path: "/investir",
    element: <Investir />
  },
]);

export default router;