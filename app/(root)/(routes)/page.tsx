'use client'

import { useModalDialog } from "@/hooks/use-modal-dialog";
import { useEffect } from "react";



const SetHomePage = () => {
     
    const onOpen = useModalDialog((state) => state.onOpen);
    const isOpen = useModalDialog((state) => state.isOpen);

    useEffect(() => {
        if (!isOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]);
  
    return  null
}
 
export default SetHomePage;