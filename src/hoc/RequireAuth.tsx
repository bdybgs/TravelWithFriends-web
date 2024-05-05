import { useLocation, Navigate } from "react-router-dom";
import React, { ReactNode } from "react";

const RequireAuth = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const auth = true;
//
    if (!auth) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}

export { RequireAuth };
