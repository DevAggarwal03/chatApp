import axios from "axios";
import React, { createContext, useRef } from "react";
import { useState } from "react";
export const AuthContext = createContext<any>('');


function AuthContextProvider({children}: {children: React.ReactNode}) {

    const backEndURL = import.meta.env.VITE_BACKEND_URL;
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<any>();
    const [signInPage, setSignInPage] = useState<boolean>(false);
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

    const setToken = (token: string) => {
        localStorage.setItem('token', token);
    }

    const getToken = () => {
        const token = localStorage.getItem('token');
        return token;
    }

    const revokeToken = () => {
        localStorage.removeItem('token');
    }

    const signOut = () => {
        setIsSignedIn(false);
        setUserInfo(undefined);
        revokeToken();
    } 

    const signIn = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post(`${backEndURL}/api/v1/auth/signin`, {
                username,
                email,
                password
            })
            const token = response.data.token;
            setIsSignedIn(true);
            setToken(token);
            return response.data;
        } catch (error) {
            console.log(error);
            return {
                message: "try again later",
                success: false
            }
        }
    }

    const fetchUser = async() => {
       try {

        const token = getToken()
        console.log(token);
        const response = await axios.get(`${backEndURL}/api/v1/auth/fetchUser`, {
           headers: {
            // Authorization: `Bearer ${token}`,
            token: token?.toString(),           
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
       <AuthContext.Provider value={{signInPage, getToken, signOut, setSignInPage, signIn, userInfo, setUserInfo, signUp, fetchUser}}>
           {children}
       </AuthContext.Provider> );
}

export default AuthContextProvider;