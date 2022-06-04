import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext/UserContext";

export default function AuthGuard({ children }) {
    const { user } = useContext(UserContext)
    const location = useLocation();

    return !!user.id
        ? children
        : <Navigate to='/login' replace state={{ path: location.pathname }} />;
}