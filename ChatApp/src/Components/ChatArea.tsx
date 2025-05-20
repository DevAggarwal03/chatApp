import TypingBox from "./ui/TypingBox";
import { contactInterface } from "../Utils/Interfaces";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { SocketContext } from "../AppContext";
import { AuthContext } from "../AuthContext";
interface chatAreaInterface {
    selected: number | null,
}

function ChatArea({selected}: chatAreaInterface) {
    //wirte logic to fetch all the stored messages/chats between them
    // currMessages: {
    //     userId1: [
    //         {}, {}, {}...
    //     ],
    //     userId2: [
    //         {}, {}, {}...
    //     ]
    // }
    
    //for now anyone can send and recieve message
    const {currentMsgs, setCurrentMsgs} = useContext(SocketContext);
    const {userInfo} = useContext(AuthContext);
    const {webSocketRef} = useContext(SocketContext) 

    const websocketServer = import.meta.env.VITE_WEB_SOCKET_SERVER;

    useEffect(() => {
        if(userInfo && selected){
            console.log(userInfo.username, " ", userInfo.id)
            const ws : WebSocket = new WebSocket(`${websocketServer}?username=${userInfo.username}&userId=${userInfo.id}`)
            webSocketRef.current = ws;
            ws.onmessage = ((ev:MessageEvent) => {
                const recData = JSON.parse(ev.data);
                console.log(JSON.parse(ev.data));
                console.log(currentMsgs);
                setCurrentMsgs((prev: any) => ({
                    ...prev,
                    [recData.from.userId]: prev[recData.from.userId] ? [...prev[recData.from.userId], recData] : [recData]
                }));

            })
        }
    }, [userInfo])

    if(currentMsgs){
        console.log(selected);
        console.log(currentMsgs);
    }

    
    return ( <div className="w-full relative flex flex-col rounded-lg bg-[#2a9d8f] min-h-[98%] border-2 border-black">
        <div className="max-h-[84vh] w-full overflow-auto flex gap-y-2 flex-col py-2">
            {
                selected && userInfo && currentMsgs[selected]?.map((msg:any, index:number) => (
                    <div className={`bg-[#e9c46a] ${(msg.from.username ===  userInfo.username) ? 'place-self-end': ''} flex p-2 gap-y-1 flex-col mx-3 rounded-xl min-w-[200px] w-4/12 max-w-[450px]`} key={index}>
                        <span className="text-[#264653] font-bold">{(msg.from.username === userInfo.username) ? "Me" : msg.from.username}</span>
                        <span>{msg.message}</span>
                    </div>
                ))
            }
        </div>
        <div className="absolute flex items-center justify-center gap-x-1.5 px-1 w-full bottom-1">
            <TypingBox selected={selected}/>
        </div>
    </div> );
}

export default ChatArea;