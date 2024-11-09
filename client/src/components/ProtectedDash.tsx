import React from "react";
import DashLayout from "./DashLayout";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import { Navigate } from "react-router-dom";

const ProtectedDash = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? <DashLayout /> : <Navigate to="/" replace />;
};

export default ProtectedDash;
