import React, { useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SocketContext } from "../../AppContext";
import { AuthContext } from "../../AuthContext";

function TypingBox({selected}: {selected: number | null}) {
    const [messageToSend, setMessageToSend] = useState<string>("");
    const changeHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageToSend(e.target.value);
    }
    const {webSocketRef, setCurrentMsgs} = useContext(SocketContext);
    const {userInfo} = useContext(AuthContext);
    
    const clickHandeler = () => {
        console.log('selectd: ', selected);
        if(selected && messageToSend !== "" && messageToSend !== undefined && webSocketRef.current.OPEN){
            const temp = {from: {username: userInfo.username, userId: userInfo.id, isOnline: true}, message: messageToSend};
            setCurrentMsgs((prev: any) => ({
                ...prev,
                [selected]: prev[selected] ? [...prev[selected], temp] : [temp]
            }));


            webSocketRef.current.send(JSON.stringify(
                {
                    type: 'chat',
                    payload: {
                        to: selected,
                        text: messageToSend
                    }
                }
            ))
        }
    }
    return ( 
        <>
            <input placeholder="Message..." value={messageToSend} onChange={changeHandeler} className="w-11/12 min-h-[30px] rounded-sm bg-[#e9c46a] px-2"/>
            <button onClick={clickHandeler} className="w-1/12 min-h-[30px] rounded-sm bg-[#e9c46a]">
                Send
            </button>
        </>
    );
}

export default TypingBox;