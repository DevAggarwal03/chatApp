import TypingBox from "./ui/TypingBox";
import { contactInterface } from "../Utils/Interfaces";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useContext } from "react";
import { SocketContext } from "../AppContext";
interface chatAreaInterface {
    selected: number,
    contacts: contactInterface[]
}

function ChatArea({selected, contacts}: chatAreaInterface) {
    //wirte logic to fetch all the stored messages/chats between them

    
    //for now anyone can send and recieve message
    const {serverURL, userData} = useContext(SocketContext)
    const {previousMsgs, setPreviousMsgs} = useContext(SocketContext);
    const {lastMessage} = useWebSocket(serverURL, {
        share: true,
        queryParams: {
            'username': userData.userName,
        }
    });


    useEffect(() => {
        if(lastMessage !== null){
            const temp = {name: JSON.parse(lastMessage.data).from.username, message: JSON.parse(lastMessage.data).message};
            console.log(temp);
            setPreviousMsgs((prev:any) => [...prev, temp]);
        }
    }, [lastMessage]);
    
    return ( <div className="w-full relative flex flex-col rounded-lg bg-[#2a9d8f] min-h-[98%] border-2 border-black">
        <div className="max-h-[84vh] w-full overflow-auto flex gap-y-2 flex-col py-2">
            {
                previousMsgs?.map((prevMessage:any, index:number) => (
                    <div className={`bg-[#e9c46a] ${prevMessage.name === "Me" ? 'place-self-end': ''} flex p-2 gap-y-1 flex-col mx-3 rounded-xl max-w-[450px]`} key={index}>
                        <span className="text-[#264653] font-bold">{prevMessage.name}</span>
                        <span>{prevMessage.message}</span>
                    </div>
                ))
            }
        </div>
        <div className="absolute flex items-center justify-center gap-x-1.5 px-1 w-full bottom-1">
            <TypingBox/>
        </div>
    </div> );
}

export default ChatArea;