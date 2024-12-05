import { create } from 'zustand'

interface SharepopupType{
    isOpen : boolean,
    setIsOpen:(value : boolean)=>void
}

export const useSharePopUp=create<SharepopupType>((set)=>({
    isOpen : false,
    setIsOpen :(value : boolean)=>set({isOpen : value})
}))