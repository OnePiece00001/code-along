import React from 'react'
import Avatar from 'react-avatar'

const Client = ({userName}) => {
    // console.log(userName);
  return (
    <div className='flex items-center flex-col font-bold '>
        <Avatar name={userName} size={50} round='14px' />
        <span className='text-white mt-[10px]'>{userName}</span>
    </div>
  )
}

export default Client