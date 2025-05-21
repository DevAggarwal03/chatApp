import { useContext } from 'react';
import defImg from '../../assets/profile-default-svgrepo-com.svg'
import { AuthContext } from '../../AuthContext';
import { SocketContext } from '../../AppContext';

function ReqCard({req, setOpenReqModel}:any) {
    const {userInfo} = useContext(AuthContext);
    const {reqHandeler} = useContext(SocketContext);
    const acceptHandeler = () => {
        reqHandeler(true, req.request_id);
        setOpenReqModel((prev:Boolean) => !prev)

    }
    console.log('req: ', req)
    return ( <div className='z-50 relative flex gap-x-2.5  bg-[#e9c46a] rounded-lg min-w-[250px] max-w-[300px] p-4'>
        <img src={defImg} className='z-[52] size-[70px]'/>
        <div className='flex font-mono flex-col justify-center font-bold text-[#023047] gap-y-4'>
            <span>{req.friend_username}</span>
            <span>ID: {req.user_id}</span>
        </div>
        <div className='flex flex-col font-mono justify-center font-bold gap-y-4'>
            <span className='mt-auto'>Pending...</span>
            {
                req.requester_id != userInfo.id ? <button onClick={acceptHandeler} className='bg-[#f39345] rounded-lg'>Accept</button> : (<></>)
            }
        </div>
    </div> );
}

export default ReqCard;