import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./store/useAuth";
import Cookies from "js-cookie";
import { useEffect } from "react";

const ProtectedRoute = () => {
    const isLoggedIn = useAuth((state) => state.isLoggedIn);
    const setIsLoggedIn = useAuth((state) => state.setIsLoggedIn);

    useEffect(() => {
        const userToken = Cookies.get("token");
        if (userToken) {
            setIsLoggedIn(true);
        }
    }, [setIsLoggedIn]);

    if (!isLoggedIn) {
        return <div >Loading...</div>;
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
