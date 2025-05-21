import { useContext, useEffect, useState } from "react";
import ChatArea from "../Components/ChatArea";
import searchImg from '../assets/search-sort-svgrepo-com.svg'
import plusImg from '../assets/plus-square-svgrepo-com.svg'
import { SocketContext } from "../AppContext";
import { AuthContext } from "../AuthContext";
import defImg from '../assets/profile-default-svgrepo-com.svg'
import ReqModel from "../Components/ReqModel";
import { useNavigate } from "react-router";


function HomePage({toggleModel}: any) {
    const [, setSearchWord] = useState<string>("");
    const {selectedPerson, setSelectedPerson, userData,fetchFriendRequests, sentRequests, setSentRequests, recievedRequests, setRecievedRequests, acceptedRequests, setAcceptedRequests} = useContext(SocketContext)
    const {fetchUser, setUserInfo, getToken, userInfo} = useContext(AuthContext);
    const [selectSentReqModel, setSelectSentModel] = useState<boolean>(true);
    const [openReqModel, setOpenReqModel] = useState<boolean>(false);
    const searchInputHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if(!token){
            navigate('/');
        }
    }, [])

    const selectModalHandeler = (e: any) => {
        if(e.target.id == "sentReq"){
            setSelectSentModel(true);
            setOpenReqModel(true);
        }else{
            setSelectSentModel(false);
            setOpenReqModel(true);
        }
    }

    useEffect(() => {
        fetchUser(userData.userName).then((res:any) => {setUserInfo(res.user)});
        fetchFriendRequests("accepted").then((res:any) => {
            setAcceptedRequests(res.requests);
            setSelectedPerson(res.requests[0]['user_id']);
        });
    }, [])

    useEffect(() => {
        if(userInfo){
            fetchFriendRequests("pending").then((res:any) => {
                let temp = res.requests.filter((request:any) => request.requestee_id == userInfo.id);
                setRecievedRequests(temp);
                temp = res.requests.filter((req:any) => req.requester_id == userInfo.id);
                setSentRequests(temp);
            });
        }
    }, [userInfo])

    return ( 
        <div className="flex w-full px-3 min-h-[90vh] gap-x-2">
            {
                openReqModel && <ReqModel setOpenReqModel = {setOpenReqModel} selectSentReqModel = {selectSentReqModel}/>
            }
            <div className="min-h-full w-3/12 border-2 bg-[#f4a261] flex flex-col gap-y-2 p-3 border-black rounded-xl">
                <div className="flex gap-x-0.5 rounded-xl  max-h-[35px]">
                    <input type="text" className="bg-[#e9c46a] h-full rounded-xl w-8/12 placeholder:text-[#264653] p-2 m-[1px]" placeholder="Search Friends" id="search" onChange={searchInputHandeler}/>
                    <button className="bg-[#e9c46a] flex justify-center items-center rounded-xl">
                        <img className="size-[45px]" src={searchImg}/>
                    </button>
                    
                    <button className="bg-[#e9c46a] w-2/12 flex justify-center items-center rounded-xl">
                        <img className="size-[32px]" src={plusImg} onClick={toggleModel}/>
                    </button>
            </div>
                <div className="flex flex-col gap-y-2 flex-grow overflow-auto">
                {
                   acceptedRequests?.map((friend: any) => 
                    {
                        return <div key={friend.request_id} onClick={() => {setSelectedPerson(friend['user_id'])}} className={`flex border-3 ${selectedPerson == friend['user_id'] ? 'border-[#e9c46a] scale-103': 'border-none'} rounded-xl bg-[#023047] p-2 text-white gap-x-2`}>
                            <img src={defImg} className="size-[80px]"/>
                            <div className="flex flex-col py-4">
                                <span className="text-green-300 font-bold">{friend.friend_username}</span>
                            </div>  
                        </div>
                    })
                }    
                </div>
                <div className="flex flex-col gap-y-1.5">
                    <div onClick={selectModalHandeler} className="relative w-full">
                        <div className={`${sentRequests.length > 0 ? 'visible':'hidden'} rounded-lg flex justify-center bg-[#f39345] items-center absolute right-1.5 bottom-[50%] translate-y-[53%] w-[33px] h-[33px] text-center align-middle`}>{sentRequests.length}</div>
                        <div id="sentReq" className="bg-[#e9c46a] h-full rounded-xl w-full p-2 m-[1px]">Sent Requests</div>
                    </div>
                    <div onClick={selectModalHandeler} className="relative w-full">
                        <div className={`${recievedRequests.length > 0 ? 'visible':'hidden'} rounded-lg flex justify-center bg-[#f39345] items-center absolute right-1.5 bottom-[50%] translate-y-[53%] w-[33px] h-[33px] text-center align-middle`}>{recievedRequests.length}</div>
                        <div id="recReq" className="bg-[#e9c46a] h-full rounded-xl w-full p-2 m-[1px]">Recieved Requests</div>
                    </div>
                </div>
            </div>

            <div className="min-h-full w-9/12 px-2 py-[1px] items-center justify-center flex border-2 bg-[#e9c46a] border-black rounded-xl">
                <ChatArea selected={selectedPerson}/>
            </div>

        </div>
     );
}

export default HomePage;