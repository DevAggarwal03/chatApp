import React, { useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SocketContext } from "../../AppContext";

function TypingBox({}) {
    const [messageToSend, setMessageToSend] = useState<string>("");
    const changeHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageToSend(e.target.value);
    }
    const {serverURL, setPreviousMsgs, userData} = useContext(SocketContext);
    const sendTo = "84852241-6f15-44aa-8ec3-c690fc9c7b0d";
    const {sendJsonMessage, readyState} = useWebSocket(serverURL, {
        share: true,
        queryParams: {
           'username': userData.userName,  
        }
    })
    const clickHandeler = () => {
        if(messageToSend !== "" && messageToSend !== undefined && readyState === ReadyState.OPEN){
            const temp = {name: "Me", message: messageToSend};
            setPreviousMsgs((prev:any) => [...prev, temp])
            
            sendJsonMessage({
                to: sendTo,
                text: messageToSend
            });
            setMessageToSend("");
        }
    }
    return ( 
        <>
            <input placeholder="Message..." value={messageToSend} onChange={changeHandeler} className="w-11/12 min-h-[30px] rounded-sm bg-[#e9c46a] px-2"/>
            <button disabled={readyState !== ReadyState.OPEN} onClick={clickHandeler} className="w-1/12 min-h-[30px] rounded-sm bg-[#e9c46a]">
                Send
            </button>
        </>
    );
}

export default TypingBox;