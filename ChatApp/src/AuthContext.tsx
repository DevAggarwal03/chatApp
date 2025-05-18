import axios from "axios";
import React, { createContext, useRef } from "react";
import { useState } from "react";
export const AuthContext = createContext<any>('');


function AuthContextProvider({children}: {children: React.ReactNode}) {

    const backEndURL = import.meta.env.VITE_BACKEND_URL;
    const [userInfo, setUserInfo] = useState<any>();

    const signUp = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post(`${backEndURL}/api/v1/auth/signup`, {
                username,
                email,
                password
            })
            return response.data;
        } catch (error) {
            console.log(error);
            return {
                message: "try again later",
                success: false
            }
        }
    }

    const fetchUser = async(username: string) => {
       try {
        const response = await axios.get(`${backEndURL}/api/v1/auth/fetchUser`, {
            params: {
                username
            }
        })

        return response.data;
       } catch (error) {
        console.log(error);
        return {
            success:false,
            error: error
        } 
       } 
        
    }

    return ( 
       <AuthContext.Provider value={{userInfo, setUserInfo, signUp, fetchUser}}>
           {children}
       </AuthContext.Provider> 
     );
}

export default AuthContextProvider;