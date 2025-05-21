import { useContext } from "react";
import plusImg from '../assets/plus-square-svgrepo-com.svg'
import { SocketContext } from "../AppContext";
import ReqCard from "./ui/ReqCard";

function ReqModel({setOpenReqModel, selectSentReqModel}:{setOpenReqModel: any, selectSentReqModel: boolean}) {
    const {sentRequests, recievedRequests} = useContext(SocketContext)
    console.log('model type: ', selectSentReqModel);
    const closeModelHandeler = () =>{
        setOpenReqModel((prev:Boolean) => !prev)
    }
    return ( <div className="absolute flex justify-center items-center w-full translate-x-[-12px] translate-y-[-9vh] h-screen z-40  bg-black/30 ">
        <div className="bg-[#f4a261] rounded-xl h-[60%] w-[55%] opacity-[100%]">
           <div className={`flex p-4 px-[25px] justify-center flex-wrap gap-x-2.5`}> 
            {
                selectSentReqModel ? (
                    sentRequests.length > 0 ? (
                        sentRequests.map((req:any, index: number) => {
                            return <div className="h-[120px]" key={index}>
                                <ReqCard req={req} setOpenModel = {setOpenReqModel}/>
                            </div>
                        })
                    ) : 
                    (
                         <div className='z-50 relative flex justify-center items-center gap-x-2.5 bg-[#e9c46a] rounded-lg min-w-[250px] max-w-[300px] p-4'>
                            <span className="font-mono  justify-center font-bold text-[#023047] gap-y-4">No Requests Sent</span>
                        </div>
                    )
                ) :
                (
                    recievedRequests.length > 0 ? (
                        recievedRequests.map((req:any, index: number) => {
                            console.log(req)
                            return <div className="h-[120px]" key={index}>
                                <ReqCard req={req} setOpenReqModel = {setOpenReqModel}/>
                            </div>
                        })
                    ) : 
                    (
                        <div className='z-50 relative flex justify-center items-center gap-x-2.5 bg-[#e9c46a] rounded-lg min-w-[250px] max-w-[300px] p-4'>
                            <span className="font-mono  justify-center font-bold text-[#023047] gap-y-4">No Requests Recieved</span>
                        </div>
                    )
                )
            }
            </div>
        </div>
        <img src={plusImg} onClick={closeModelHandeler} className='absolute right-[23%] top-[21%] rotate-45 size-[23px]'/>
    </div> );
}

export default ReqModel;