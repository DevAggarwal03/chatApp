import axios from "axios";
import React, { createContext, useContext, useRef } from "react";
import { useState } from "react";
import { AuthContext } from "./AuthContext";
export const SocketContext = createContext<any>('');


function AppContextProvider({children}: {children: React.ReactNode}) {
    
    const {getToken} = useContext(AuthContext);
    const serverHttpURL = import.meta.env.VITE_BACKEND_URL;
    const serverURL = import.meta.env.VITE_WEB_SOCKET_SERVER;
    const [userData, setUserData] = useState<any>({userName: "", password: "", email: ""})
    const webSocketRef = useRef<WebSocket | null>(null);
    const [selectedPerson, setSelectedPerson] = useState<number | null>(null)
    const [currentMsgs, setCurrentMsgs] = useState([])
    const [acceptedRequests, setAcceptedRequests] = useState<any>([]);
    const [sentRequests, setSentRequests] = useState<any>([]);
    const [recievedRequests, setRecievedRequests] = useState<any>([]);

    const fetchFriendRequests = async(status: string) => {
        try {
            const response = await axios.get(`${serverHttpURL}/api/v1/fetchRequests`, {
                headers:{
                    token: getToken(),
                },
                params: {
                    status: status
                }
            })
            return response.data
        } catch (error) {
            console.error("error while fetching requests: ", error);
            return {};        
        }
    }

    const reqHandeler = async(isAccept : boolean, req_id : number) => {
        try {
            const data = {
                isAccept,
                req_id
            }
            const response = await axios.post(`${serverHttpURL}/api/v1/awknowledgeRequest`, data, {
                headers: {
                    token: getToken()
                }
            })
            return response.data;
        } catch (error) {
           console.log(error);
           return {
            success: false,
            error: error
           } 
        }
    }

    const sendFriendRequest = async(friendId: number) => {
        try {
            const token = getToken();
            const response = await axios.post(`${serverHttpURL}/api/v1/sendRequest`,{friendId} ,{
                headers: {
                    token
                },
            })

            return response.data;
        } catch (error) {
           console.log(error);
           return {
            success: false,
            error: error
           } 
        }
    }

    const fetchStoredChats = async(recieverId: number) => {
        try {
            const response = await axios.get(`${serverHttpURL}/api/v1/room/fetchmessages`, {
                headers: {
                    token: getToken()
                },
                params: {
                    rec_id: recieverId
                }
            })
            return response.data;
        } catch (error) {
           console.log(error);
           return {
            success: false,
            error: error
           } 
        }
    }

    return ( 
       <SocketContext.Provider value={{selectedPerson, reqHandeler, sendFriendRequest, fetchStoredChats, setSelectedPerson, webSocketRef, recievedRequests, setRecievedRequests, userData, acceptedRequests, setAcceptedRequests, sentRequests, setSentRequests, fetchFriendRequests, setUserData, currentMsgs, setCurrentMsgs, serverURL}}>
           {children}
       </SocketContext.Provider> 
     );
}

export default AppContextProvider;