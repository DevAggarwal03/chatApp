import { useContext, useEffect} from "react";
import { SocketContext } from "../AppContext";
import { useNavigate } from "react-router";
import { AuthContext } from "../AuthContext";

function SignInPage({changeHandeler}: any) {
    const navigate = useNavigate(); 
    const {userData} = useContext(SocketContext)
    const {signUp, signIn, signInPage, getToken} = useContext(AuthContext);

    useEffect(() => {
        const token = getToken();
        if(token){
            navigate('/chat');
        }
    }, [])

    const submitHandeler = async() => {
        console.log(userData)
        if(signInPage == true){
            const res = await signIn(userData.userName, userData.email, userData.password);
            if(res?.success){
                navigate('/chat')
            }
            else{
                console.log(res?.message);
            }
        }else{
            const res = await signUp(userData.userName, userData.email, userData.password);
            if(res?.success){
                navigate('/chat')
            }
            else{
                window.alert(res?.message + "! Sign in via signIn page");
            }
        }
    }

    return ( <div className="w-full h-full flex justify-center items-center">
        <div className="w-5/12 rounded-xl bg-[#f4a261] p-4 flex justify-center gap-y-4 items-center flex-col">
            <h1 className="text-3xl text-[#2a9d8f] font-bold">{signInPage ? "Sign In" : "Sign up"}</h1>
            <div className="flex gap-y-1 flex-col rounded-xl w-full">
                <div className="bg-[#f6b27b] p-2 flex flex-col gap-y-1">
                    <label htmlFor="userName">UserName</label>
                    <input
                        onChange={changeHandeler}
                        className="bg-[#f4a261] p-3 py-1"
                        id="userName"
                        type="text"
                        placeholder="Enter user name"
                    />                
                </div>
                <div className="bg-[#f6b27b] p-2 flex flex-col gap-y-1">
                    <label htmlFor="email">Email ID</label>
                    <input
                        onChange={changeHandeler}
                        className="bg-[#f4a261] p-3 py-1"
                        id="email"
                        type="email"
                        placeholder="Enter user name"
                    />                
                </div>
                <div className="bg-[#f6b27b] p-2 flex flex-col gap-y-1">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={changeHandeler}
                        className="bg-[#f4a261] p-3 py-1"
                        id="password"
                        type="password"
                        placeholder="Enter user Password"
                    />                
                </div>
            </div>
            <button onClick={submitHandeler} className="p-3 bg-gray-300 text-black rounded-lg w-full py-2">
                Submit
            </button>
        </div>
    </div> );
}

export default SignInPage;