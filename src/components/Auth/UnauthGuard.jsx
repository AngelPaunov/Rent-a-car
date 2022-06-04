import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext/UserContext";

export default function UnauthGuard({ children }) {
    const { user } = useContext(UserContext)
    
    return !user.id
        ? children
        : <Navigate to='/' replace/>;
}