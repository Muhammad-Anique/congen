import React, { useState } from 'react'


function Message(props) {

    const { message, user, receiver } = props;

    // Function to format time from timestamp
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
  
    // Determine the sender's name
    const senderName = message.senderId === receiver.id ? receiver.name : (message.senderId === user.id ? 'Me' : '');
  
    

    return (
      <div className='flex-col px-3 py-2'>
        <div className='flex flex-row gap-2 items-center'>
          <img    src={ senderName==receiver.name ? `https://avatar.oxro.io/avatar.svg?name=${senderName.split(' ')[0]}+${senderName.split(' ')[1]}` : (senderName=='Me' ?`https://avatar.oxro.io/avatar.svg?name=${user.name.split(' ')[0]}+${user.name.split(' ')[1]}` : `` )} className='h-[40px] w-[40px] rounded-full bg-red-100'/>
          <div className='flex flex-col'>
            <p className='font-medium'>{senderName}</p>
            <p className='text-sm'>{formatTime(message.created_at)}</p>
          </div>
        </div>
        <div className='mt-3 text-lg bg-gray-100 rounded-tr-lg rounded-b-lg p-[10px]'>
          <p className='px-3 text-md'>{message.messageContent}</p>
        </div>
      </div>
    );
}

export default Message
