import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Protected;
