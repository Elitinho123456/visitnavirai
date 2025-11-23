//Default import statements
import { createBrowserRouter } from "react-router-dom";

// Importing the components
import Error from "../components/pages/Error.tsx";
import Home from "../components/pages/Home.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />
  }
]);

export default router;