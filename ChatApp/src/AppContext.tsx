import React, { createContext, useRef } from "react";
import { useState } from "react";
export const SocketContext = createContext<any>('');


function AppContextProvider({children}: {children: React.ReactNode}) {
    
    
    const serverURL = import.meta.env.VITE_WEB_SOCKET_SERVER;
    const [userData, setUserData] = useState<any>({userName: "", password: "", email: ""})
    const [previousMsgs, setPreviousMsgs] = useState([])

   
    return ( 
       <SocketContext.Provider value={{userData, setUserData, previousMsgs, setPreviousMsgs, serverURL}}>
           {children}
       </SocketContext.Provider> 
     );
}

export default AppContextProvider;