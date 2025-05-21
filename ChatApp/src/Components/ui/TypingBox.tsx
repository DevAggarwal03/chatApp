import React, { useContext, useRef, useState } from "react";
import { SocketContext } from "../../AppContext";
import { AuthContext } from "../../AuthContext";

function TypingBox({selected}: {selected: number | null}) {
    const [messageToSend, setMessageToSend] = useState<string>("");
    const changeHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageToSend(e.target.value);
    }
    const sendBtnRef = useRef<HTMLButtonElement>(null);
    const {webSocketRef, setCurrentMsgs} = useContext(SocketContext);
    const {userInfo} = useContext(AuthContext);
    
    const clickHandeler = () => {
        console.log('selectd: ', selected);
        if(selected && messageToSend !== "" && messageToSend !== undefined && webSocketRef.current.OPEN){
            const temp = {s_id: userInfo.id, s_username: userInfo.username, message: messageToSend};
            setCurrentMsgs((prev: any) => ([
                ...prev,
                temp
            ]));


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

        setMessageToSend("");
    }

    if(sendBtnRef.current){
        sendBtnRef.current.addEventListener('keypress', (e: any) => {
            if(e.key == 'enter'){
                clickHandeler();
            }
        })
    }
    
    const keyDownHandeler = (e: any) => {
        if(e.key === 'Enter'){
            clickHandeler();
        }
    }

    return ( 
        <>
            <input onKeyDown={keyDownHandeler} placeholder="Message..." value={messageToSend} onChange={changeHandeler} className="w-11/12 min-h-[30px] rounded-sm bg-[#e9c46a] px-2"/>
            <button  ref={sendBtnRef} onClick={clickHandeler} className="w-1/12 min-h-[30px] rounded-sm bg-[#e9c46a]">
                Send
            </button>
        </>
    );
}

export default TypingBox;