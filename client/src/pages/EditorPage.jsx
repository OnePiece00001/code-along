import React, { useEffect, useRef, useState } from 'react'
import toast, { LoaderIcon } from 'react-hot-toast'
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket/socket';
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom'
import ACTIONS from '../constants/actions';
const EditorPage = () => {
  const location = useLocation();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const {roomId} = useParams();
  const reactNavigate = useNavigate();
  const [clients, setClients] = useState([])

  codeRef.current=localStorage.getItem('Code');
  useEffect(() => {
    const init = async () => {
    socketRef.current = await initSocket();
    socketRef.current.on('connct-error', (err) => handleErrors(err));
    socketRef.current.on('connct-failed', (err) => handleErrors(err));

    function handleErrors(e) {
      console.log('socket error ', e);
      toast.error('Socket connection failed, try again later');
      reactNavigate('/')
    }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName,
      });

      // Listening for joned event
      socketRef.current.on(ACTIONS.JOINED,({clients, userName, socketId}) => {
        if(userName !== location.state?.userName) {
          toast.success(`${userName} joined the room. `)
          // console.log({userName});
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId
        });
      })

      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, userName}) => {
        toast.success(`${userName} left the room`)
        setClients((prev) => {
          return prev.filter(client => client.socketId !==socketId)
        })
      })
    };
    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();

    }
  }, [])

  async function copyId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Copied Room ID')
    } catch (error) {
      toast.error('Could not copy the Room ID');
      console.log(error);
    }
  }

  function leaveRoom() {
    reactNavigate('/')
  }

  if(!location.state) {
    <Navigate to='/'/>
  }

  return (
    <div className='grid grid-cols-[230px,1fr] h-screen'>
      <div className='bg-[#1c1e29] p-4 text-white flex flex-col'>
        <div className='flex-1'>
          <div className='border-b-2 border-[#424242] pb-[10px] flex items-center gap-1'>
            <img className='h-[60px]' src="../../code-editor.png" alt="logo" />
            <span className='text-2xl text-indigo-300 font-mono'>CodeAlong</span>
          </div>
          <h3>Connected</h3>
          <div className=' flex items-center flex-wrap gap-5 mt-3'>
            {
              clients.map((client) => {
                return <Client key={client.socketId} userName={client.userName} />
              })
            }
          </div>
        </div>
        <button className='p-[10px] rounded-md mb-4 bg-[#eee] font-bold text-black' onClick={copyId}>Copy Room ID</button>
        <button onClick={leaveRoom} className='p-[10px] rounded-md cursor-pointer transition-all duration-[0.5s] bg-[#6469ff] hover:bg-[#4a50fa] mt-[20px]'>Leave</button>
      </div>
      <div>
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {codeRef.current=code;localStorage.setItem('Code', code);}}/>
      </div>
    </div>
  )
}

export default EditorPage