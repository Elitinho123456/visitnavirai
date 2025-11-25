//Default import statements
import { createBrowserRouter } from "react-router-dom";

// Importing the components
import Error from "../components/pages/Error.tsx";
import Home from "../components/pages/Home.tsx";

// Importing Headers Components
// Navirai Pages
import Historia from "../components/pages/navirai/Historia.tsx";
// Onde Dormir Pages
import Hoteis from "../components/pages/ondeDormir/Hoteis.tsx";

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
  }
]);

export default router;