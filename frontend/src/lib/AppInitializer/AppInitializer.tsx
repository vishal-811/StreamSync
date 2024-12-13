import { useAuth } from "@/store/useAuth";
import Cookies from "js-cookie";
import { useEffect } from "react";

const AppInitializer = () => {
  const setIsLoggedIn = useAuth((state) => state.setIsLoggedIn);

  useEffect(() => {
    const userToken = Cookies.get("token");
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);
  return null;
};

export default AppInitializer;
