import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import DashHome from "./pages/DashHome";
import DashLayout from "./components/DashLayout";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedDash from "./components/ProtectedDash";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Login />,
        path: "/",
        index: true,
      },
      {
        element: <Register />,
        path: "/register",
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    element: <ProtectedDash />,
    path: "/dash",
    children: [
      {
        element: <Profile />,
        path: "/dash/profile",
      },
    ],
  },
]);
export default router;
