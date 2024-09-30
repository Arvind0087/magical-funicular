import { Navigate, useLocation } from "react-router";

export const ProtectedRoute = ({ children, authToken, authStatus }) => {
    const location = useLocation();
    if (!authToken || !authStatus) {
        return <Navigate to='/register' state={{ from: location }} />
    }
    return children;
}