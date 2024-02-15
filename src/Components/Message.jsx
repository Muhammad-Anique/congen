import React, { useEffect, useState } from 'react'
import supabase from '../config/supabaseClient';


function Message(props) {



    const { message, user, receiver } = props;
    const [activityFound, setActivityFound] =useState(false)
    const [name, setName] =useState('')
    const [type, setType] =useState('')
    const [activity,setActivity]=useState('')
    const [content, setContent] =useState(message.messageContent)
    const [receiverImage, setReciverImage] =useState(receiver.profilePic)
    const [senderImage, setSenderImage] =useState(user.profilePic) 
   

    useEffect(()=>{
      function getActivivtyFromMessage(message) {
        console.log("The message : - ", message)          
        // Regular expression patterns to match the tags and values
        let activityPattern = /<\$%activity%\$>\s*([^<>]+)\s*<\$%activity%\$>/;
        let namePattern = /<\$%name%\$>\s*([^<>]+)\s*<\$%name%\$>/;
        let typePattern = /<\$%type%\$>\s*([^<>]+)\s*<\$%type%\$>/;

        // Extract activity
        let activityMatch = message.match(activityPattern);
        let activity = activityMatch ? activityMatch[1] : null;

        // Extract name
        let nameMatch = message.match(namePattern);
        let name = nameMatch ? nameMatch[1] : null;

        // Extract type
        let typeMatch = message.match(typePattern);
        let type = typeMatch ? typeMatch[1] : null;

        // Output extracted values
        console.log("Activity__:", activity);
        console.log("Name__:", name);
        console.log("Type__:", type);
  
        if (activity && name && type) {
            setActivityFound(true)
            setName(name)
            setType(type)
            setActivity(activity)
            setContent("Hey!")

            console.log("Name:", name);
            console.log("Type:", type);
            console.log("Activity:", activity);

        } else {
            console.log("No match found.");
        }
      }

      getActivivtyFromMessage(message.messageContent)

    },[])

    // Regular expression pattern to match the tag and values
   
    // Function to format time from timestamp
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
  
    // Determine the sender's name
    const senderName = message.senderId === receiver.id ? receiver.name : (message.senderId === user.id ? 'Me' : '');
  
    

    return (
      <div className='flex-col px-3 py-2 '>
        { activityFound ? (  <div className='border-2 border-gray-200 flex flex-row items-center justify-between w-full h-auto m-1 mb-2 rounded-xl p-4 shadow-md'>
        <div className='flex flex-col'>
        <h1 className='font-bold text-primary3  '>{type}</h1>
         <p className=' text-primary2'>{activity}</p>
        </div>
        {
          props.convStatus == "pending" && message.senderId!==props.user.id ? (
            <div className='flex flex-col gap-2'>
            <button onClick={async()=>{
                     
            const { data, error } = await supabase
            .from('conversation')
            .update({ status: 'rejected' })
            .eq('id', props.message.conversationId)
            .select()
            if(data){
              alert("Request Rejected Successfully")
            }
        
            }} className='rounded-lg  bg-red-500 text-white px-4 py-1' >Reject</button>
            <button onClick={async()=>{
            const { data, error } = await supabase
            .from('conversation')
            .update({ status: 'active' })
            .eq('id', props.message.conversationId)
            .select()
            if(data){
              alert("Request Accepted Successfully")
            }

            }} className='rounded-lg bg-green-500 text-white px-4 py-1' >Accept</button>
          </div>
          ) : (
            props.convStatus == "pending" && message.senderId===props.user.id ? ( <h1 className='font-bold mr-2 border-2 p-2 rounded-lg'>Request Pending</h1> ) : ( <></>)
          )
        }
       
       
        </div>) : (<></>)}
      
      {
        props.convStatus=== "active" ? (
          <>
           <div className='flex flex-row gap-2 items-center'>
          <img    src={ senderName==receiver.name ? 
          (
          receiverImage ? (receiverImage ) : (`https://avatar.oxro.io/avatar.svg?name=${senderName.split(' ')[0]}+${senderName.split(' ')[1]}`)     
          ):         
          (
            senderName=='Me' ? ( senderImage ? senderImage : `https://avatar.oxro.io/avatar.svg?name=${user.name.split(' ')[0]}+${user.name.split(' ')[1]}`) 
          : `` 
          )
          } 
            
            
            className='h-[40px] w-[40px] rounded-full bg-red-100'/>
          <div className='flex flex-col'>
            <p className='font-medium'>{senderName}</p>
            <p className='text-sm'>{formatTime(message.created_at)}</p>
          </div>
        </div>
        
        <div className='mt-3 text-lg bg-gray-100 rounded-tr-lg rounded-b-lg p-[10px]'>
          <p className='px-3 text-md'>{content}</p>
        </div>
          </>
         
        ) :(<></>)
      }
        
       </div>
    );
}

export default Message
