import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedDash from "./components/ProtectedDash";
import EditProfile from "./pages/EditProfile";

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
      {
        element: <EditProfile />,
        path: "/dash/profile/edit",
      },
    ],
  },
]);
export default router;
