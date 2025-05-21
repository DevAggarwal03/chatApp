import TypingBox from "./ui/TypingBox";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { SocketContext } from "../AppContext";
import { AuthContext } from "../AuthContext";
interface chatAreaInterface {
    selected: number | null,
}

function ChatArea({selected}: chatAreaInterface) {
    const {currentMsgs, setCurrentMsgs} = useContext(SocketContext);
    const {userInfo} = useContext(AuthContext);
    const {webSocketRef, fetchStoredChats} = useContext(SocketContext);
    const chatsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(selected){
            fetchStoredChats(selected).then((res:any) => {
                console.log(res);
                setCurrentMsgs(res.response);
            });
        }

        return setCurrentMsgs([]);
    }, [selected])

    // currMessages: {
    //     userId1: [
    //         {}, {}, {}...
    //     ],
    //     userId2: [
    //         {}, {}, {}...
    //     ]
    // }

    const websocketServer = import.meta.env.VITE_WEB_SOCKET_SERVER;

    useEffect(() => {
        if(userInfo && selected){
            const ws : WebSocket = new WebSocket(`${websocketServer}?username=${userInfo.username}&userId=${userInfo.id}`)
            webSocketRef.current = ws;
            ws.onmessage = ((ev:MessageEvent) => {
                const recData = JSON.parse(ev.data);
                const temp = {s_id: recData.from.userId, s_username: recData.from.username, message: recData.message}
                setCurrentMsgs((prev: any) => ([
                    ...prev,
                    temp
                ]));

            })
        }

        return setCurrentMsgs([]);
    }, [userInfo, selected])

    useEffect(() => {
        if (chatsRef.current) {
            chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        }
    }, [currentMsgs])

    return ( <div className="w-full relative flex flex-col rounded-lg bg-[#2a9d8f] min-h-[98%] border-2 border-black">
        <div ref={chatsRef} className="max-h-[84vh] w-full overflow-auto flex gap-y-2 pb-5 flex-col py-2">
            {
                selected && userInfo && currentMsgs?.map((msg:any, index:number) => (
                    <div className={`bg-[#e9c46a] ${(msg.s_id ===  userInfo['id']) ? 'place-self-end': ''} flex p-2 gap-y-1 flex-col mx-3 rounded-xl min-w-[200px] w-4/12 max-w-[450px]`} key={index}>
                        <span className="text-[#264653] font-bold">{(msg.s_id === userInfo['id']) ? "Me" : msg.s_username}</span>
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