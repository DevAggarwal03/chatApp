import { useContext, useState } from 'react'
import './App.css'
import HomePage from './Pages/HomePage'
import { Route, Routes } from 'react-router'
import SignInPage from './Pages/SingInPage'
import plusImg from './assets/plus-square-svgrepo-com.svg'
import NavBar from './Components/NavBar'
import sendImg from './assets/send-svgrepo-com.svg'
import { SocketContext } from './AppContext'
function App() {
  const {setUserData, sendFriendRequest} = useContext(SocketContext);  
  const changeHandeler = (e : React.ChangeEvent<HTMLInputElement>) => {
          const {value, id} = e.target;
          setUserData((prev: any) => {
              return {
                  ...prev,
                  [id]: value
              }
          })
  }
  const [openModel, setOpenModel] = useState<boolean>(false);
  const toggleModel = () => {
    setOpenModel(prev => !prev);
  }
  const [friendId, setFriendId] = useState<number | null>(null);
  const inputHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
   setFriendId(parseInt(e.target.value));
  }
  const sendHandeler = () => {
    if(friendId && friendId > 0){
      sendFriendRequest(friendId);
      setOpenModel(prev => !prev)
    }
  }
  return (
    <div className='w-full relative flex-col min-h-screen gap-y-4 items-center flex bg-[#2a9d8f]'>
      <NavBar/>
      {
        openModel ?(
        <div className="absolute w-screen h-screen bg-[#000000] z-30 opacity-85 flex justify-center items-center">
          <div className="bg-[#ffffff] rounded-xl flex flex-col gap-y-4 p-3">
            <div className='flex justify-between w-full'>
              <span className='text-lg '>Send Friend Request</span>
              <img src={plusImg} onClick={toggleModel} className='rotate-45 size-[30px]'/>
            </div>
            <div className='flex gap-x-1'>
              <input onChange={inputHandeler} type="number" placeholder="friendId" className="active:bg-[#ddd4c9] p-3 py-1 rounded-xl border border-[#d6ccc2]"/>
              <img src={sendImg} onClick={sendHandeler} className='text-black size-[43px] bg-gray-300 cursor-pointer p-2 text-md broder border-gray-400 rounded-xl'/>
            </div>
          </div>
        </div>): (<></>) 
      }
      <Routes>
        <Route index element={<SignInPage changeHandeler={changeHandeler}/>}/>
        <Route path='/chat' element={<HomePage toggleModel={toggleModel} />}/>
      </Routes>
      
    </div>
  )
}


export default App;