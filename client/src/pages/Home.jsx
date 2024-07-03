import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
useNavigate
const Home = () => {
 
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Created a new room')
  }

  const joinRoom = () => {
    if(!roomId || !userName) {
        toast.error('Room ID & username is required')
        return ;
    }

    navigate(`/editor/${roomId}`, {
        state: {
            userName,
        }
    })
  }

  const handleInputEnter = (e) => {
    // console.log(e.code);
    if(e.code === 'Enter') joinRoom();
  }
  return (
    <>
    <div className='text-white flex items-center justify-center h-screen'>
        <div className='bg-[#3d3f4e] p-5 rounded-[10px] w-[400px] max-w-[90%]'>
            <div className='flex items-center gap-2'>
                <img className='h-20 mb-5' src="../../code-editor.png" alt="Code Along logo" />
                <span className='text-4xl pb-5 text-indigo-300 font-mono'>CodeAlong</span>
            </div>
            <h4 className='mb-5 mt-0'>Invitation room Id</h4>
            <div className='flex flex-col '>
                <input 
                    type="text" 
                    className='p-[10px] rounded-md mb-4 bg-[#eee] font-bold text-black' 
                    placeholder='Room ID'
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyUp={handleInputEnter}
                />
                <input 
                    type="text" 
                    className='p-[10px] rounded-md mb-4 bg-[#eee] font-bold text-black' 
                    placeholder='UserName'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyUp={handleInputEnter}
                />
                <button 
                    className='p-[10px] rounded-md cursor-pointer transition-all duration-[0.5s] bg-[#6469ff] w-[100px] ml-auto hover:bg-[#4a50fa]'
                    onClick={joinRoom}
                > Join </button>
                <span className=' m-[0 auto] mt-5 '>
                    If you don't have an invite then create &nbsp;
                    <a onClick={createNewRoom} href="" className='text-[#6469ff] border-b-[1px] border-[#6469ff] transition-all duration-[0.5s] ease-in-out hover:text-[#4a50fa] hover:border-[#4a50fa]'>new room</a>
                </span>
            </div>
        </div>
        <footer className='fixed bottom-1'>
            <h4>Visit <Link to="https://github.com/Onepiece00001" target='blank' className='text-[#6469ff] border-b-[1px] border-[#6469ff] '>Me</Link></h4>
        </footer>
    </div>
    </>
  )
}

export default Home