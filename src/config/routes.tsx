//Default import statements
import { createBrowserRouter, Navigate } from "react-router-dom";

// Importing the components
import Error from "@/components/pages/Error.tsx";
import Home from "@/components/pages/Home.tsx";

// Navirai Pages
import Historia from "@/components/pages/navirai/Historia.tsx";
import Investir from "@/components/pages/navirai/Investir.tsx";
// Onde Dormir Pages
import Acomodacoes from "@/components/pages/ondeDormir/hoteis/Hoteis.tsx";
import HotelInfo from "@/components/pages/ondeDormir/hoteis/HotelInfo.tsx";

// Eventos Public
import Eventos from "@/components/pages/eventos/Eventos.tsx";
// Login Page
import Login from "@/components/pages/Login.tsx";

// Middlewares (Guards)
import ProtectedRoute from "@/guards/ProtectedRoute.tsx";
import PublicRoute from "@/guards/PublicRoute.tsx";

// Admin Interface
import Dashboard from "@/features/admin/Dashboard.tsx";

// Hotel Controls
import CadGeneric from "@/features/admin/hotels/CadGeneric.tsx";
import EditGeneric from "@/features/admin/hotels/EditGeneric.tsx";
import ListHotel from "@/features/admin/hotels/ListHotel.tsx";

// Service Controls
import ListServices from "@/features/admin/services/ListServices.tsx";
import CadService from "@/features/admin/services/CadService.tsx";
import EditService from "@/features/admin/services/EditService.tsx";

// Attraction Controls
import ListAttractions from "@/features/admin/attractions/ListAttractions.tsx";
import CadAttraction from "@/features/admin/attractions/CadAttraction.tsx";
import EditAttraction from "@/features/admin/attractions/EditAttraction.tsx";

// Event Controls
import ListEvents from "@/features/admin/events/ListEvents.tsx";
import CadEvento from "@/features/admin/events/CadEvento.tsx";

// User Permissions
import UserManagement from "@/features/admin/users/UserManagement.tsx";
import UserPerms from "@/features/admin/users/UserPerms.tsx";
import RoleManagement from "@/features/admin/users/RoleManagement.tsx";

import RootLayout from "@/components/shared/RootLayout.tsx";

// Serviços
import Servicos from "@/components/pages/servicos/Servicos";
import ServicosInfo from "@/components/pages/servicos/SevicosInfo";

// Atrações
import Atracoes from "@/components/pages/atracoes/Atracoes";
import AtracaoInfo from "@/components/pages/atracoes/AtracaoInfo";

//Esportes
import Esportes from "@/components/pages/esportes/esportes";
import EsporteInfo from "@/components/pages/esportes/EsporteInfo";

// Onde Comer
import OndeComer from "@/components/pages/ondeComer/ondeComer";
import OndeComerInfo from "@/components/pages/ondeComer/ondeComerInfo";


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
            errorElement: <Error />,
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
                path: "eventos",
                element: <ListEvents />
              },
              {
                path: "eventos/novo",
                element: <CadEvento />
              },
              {
                path: "servicos",
                element: <ListServices />
              },
              {
                path: "servicos/novo",
                element: <CadService />
              },
              {
                path: "servicos/editar/:id",
                element: <EditService />
              },
              {
                path: "atracoes",
                element: <ListAttractions />
              },
              {
                path: "atracoes/novo",
                element: <CadAttraction />
              },
              {
                path: "atracoes/editar/:id",
                element: <EditAttraction />
              },
              {
                path: "usuarios",
                element: <UserManagement />
              },
              {
                path: "usuarios/permissoes",
                element: <UserPerms />
              },
              {
                path: "usuarios/cargos",
                element: <RoleManagement />
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
        path: "/event",
        element: <Eventos />
      },
      {
        path: "/investir",
        element: <Investir />
      },
      // Serviços
      {
        path: "/servicos",
        element: <Servicos />,
        children: [
          {
            path: ":id",
            element: <ServicosInfo />
          }
        ]
      },
      // Atrações
      {
        path: "/atracoes",
        element: <Atracoes />,
        children: [
          {
            path: ":id",
            element: <AtracaoInfo />
          }
        ]
      },

      // Esportes
      {
        path: "/esportes",
        element: <Esportes />,
        children: [
          {
            path: ":id",
            element: <EsporteInfo />
          }
        ]
      },

      //Onde Comer
      {
        path: "/OndeComer",
        element: <OndeComer />,
        children: [
          {
            path: ":id",
            element: <OndeComerInfo />
          }
        ]
      },


      {
        path: "*",
        element: <Error />
      }
    ]
  }
]);

export default router;