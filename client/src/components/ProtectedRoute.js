import React from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const currentUser = useSelector((state) => state.currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
