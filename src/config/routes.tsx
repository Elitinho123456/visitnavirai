//Default import statements
import { createBrowserRouter, Navigate } from "react-router-dom";

// Importing the components
import Error from "../components/pages/Error.tsx";
import Home from "../components/pages/Home.tsx";

// Navirai Pages
import Historia from "../components/pages/navirai/Historia.tsx";
import Investir from "../components/pages/navirai/Investir.tsx";
// Onde Dormir Pages
import Acomodacoes from "../components/pages/ondeDormir/hoteis/Hoteis.tsx";
import HotelInfo from "../components/pages/ondeDormir/hoteis/HotelInfo.tsx";

// Login Page
import Login from "../components/pages/Login.tsx";

// Middlewares
import ProtectedRoute from "../components/middleware/ProtectedRoute.tsx";
import PublicRoute from "../components/middleware/PublicRoute.tsx";

// Admin Interface
import Dashboard from "../components/admin/Dashboard.tsx";
import CadGeneric from "../components/admin/hotelsControls/CadGeneric.tsx";
import EditGeneric from "../components/admin/hotelsControls/EditGeneric.tsx";
import ListHotel from "../components/admin/hotelsControls/ListHotel.tsx";
import CadEvento from "../components/admin/CadEvento.tsx";
import UserManagement from "../components/admin/UserManagement.tsx";

import RootLayout from "../components/shared/RootLayout.tsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
                path: "hoteis",
                element: <ListHotel />
              },
              {
                path: "hoteis/novo",
                element: <CadGeneric />
              },
              {
                path: "hoteis/editar/:id",
                element: <EditGeneric />
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
      // Rota principal de acomodações
      {
        path: "/acomodacoes",
        element: <Acomodacoes />,
        children: [
          {
            path: ":id",
            element: <HotelInfo />
          }
        ]
      },
      // Redirects de compatibilidade
      {
        path: "/hoteis",
        element: <Navigate to="/acomodacoes?tipo=Hotel" replace />
      },
      {
        path: "/hoteis/:id",
        element: <Navigate to="/acomodacoes" replace />
      },
      {
        path: "/pousadas",
        element: <Navigate to="/acomodacoes?tipo=Pousada" replace />
      },
      {
        path: "/flats",
        element: <Navigate to="/acomodacoes?tipo=Flat" replace />
      },
      {
        path: "/camping",
        element: <Navigate to="/acomodacoes?tipo=Área de Camping" replace />
      },
      {
        path: "/historia",
        element: <Historia />
      },
      {
        path: "/investir",
        element: <Investir />
      }
    ]
  }
]);

export default router;