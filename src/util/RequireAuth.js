import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
  const location = useLocation();

  return localStorage.getItem("userTypes") === allowedRoles[0] ? (
    <Outlet />
  ) : localStorage.getItem("userTypes") ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
