//Default import statements
import { createBrowserRouter } from "react-router-dom";

// Importing the components
import Error from "../components/pages/Error.tsx";
import Home from "../components/pages/Home.tsx";

// Importing Headers Components
// Navirai Pages
import Historia from "../components/pages/navirai/Historia.tsx";
import Investir from "../components/pages/navirai/Investir.tsx";
// Onde Dormir Pages
import Hoteis from "../components/pages/ondeDormir/Hoteis.tsx";
import HotelInfo from "../components/pages/ondeDormir/HotelInfo.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />
  },
  {
    path: "/hoteis",
    element: <Hoteis />
  },
  {
    path: "/historia",
    element: <Historia />
  },
  {
    path: "/investir",
    element: <Investir />
  },

  {
    path: "/hotelInfo",
    element: <HotelInfo/>
  }
]);

export default router;