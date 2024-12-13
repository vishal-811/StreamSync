import { create } from "zustand";

interface LoggedinType{
    isLoggedIn : boolean,
    setIsLoggedIn :(value : boolean)=>void 
}

export const useAuth= create<LoggedinType>((set)=>({
    isLoggedIn : false,
    setIsLoggedIn :(value : boolean)=>set({isLoggedIn : value })
}))