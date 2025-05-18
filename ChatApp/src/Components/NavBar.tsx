import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function NavBar() {
    const {userInfo} = useContext(AuthContext);


    return ( <div className="w-screen min-h-[50px] px-10 flex justify-between items-center bg-[#264653]">
           <h1 className="text-xl text-white font-mono">ChatApp</h1> 
           {
            userInfo && <div className="flex gap-x-5 justify-center items-center text-white font-mono">
                <span>user_name : <span className="text-[#f4a261] font-bold`">{userInfo.username}</span></span> 
                <span>user_id : <span className="text-[#f4a261] font-bold">{userInfo.id}</span></span>
                <span>email : <span className="text-[#f4a261] font-bold">{userInfo.email}</span></span>
            </div>
           }
    </div> );
}

export default NavBar;