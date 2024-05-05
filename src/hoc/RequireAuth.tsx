import { useLocation, Navigate } from "react-router-dom";
import React, {ReactNode, useContext} from "react";
import {AuthContext} from "./AuthProvider";

const RequireAuth = ({ children }: { children: ReactNode }) => {
    const { user } = useContext(AuthContext);
//
    if (!user) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}

export { RequireAuth };
