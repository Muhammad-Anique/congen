import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import supabase from '../config/supabaseClient'
import Message from './Message';
import { PiSmileyLight } from "react-icons/pi";
import '../Assets/Spinner/spinner.css'
import { useTranslation } from 'react-i18next';
function ConversationComponent(props) {
  const { t } = useTranslation();
  console.log("isActive ", props.state)
  console.log("in conv comp", props.conversation)
  const [participant, setParticipant] =useState({
    name: "-----",
    email: "-----",
    pic:null
  })

  useEffect(()=>{
    
  function returnParticipant(conversation){
    if(conversation.participant1_id !== props.myProfile.id){
      setParticipant({
        name: conversation.participant1_name,
        email: conversation.participant1_email,
        pic: conversation.participant1_pic
      })
    }
    else if(conversation.participant2_id !== props.myProfile.id){
      setParticipant({
        name: conversation.participant2_name,
        email: conversation.participant2_email,
        pic: conversation.participant2_pic
      })
    }
  }
  returnParticipant(props.conversation)

  },[])

  useEffect(()=>{

    if(participant){
      console.log( "participant", participant)
    }
  },[participant])


  
  return (
    <div  onClick={()=>{props.Click(props.conversation.conversation_id)}} className={`flex flex-row w-full py-4 px-[25px] h-[100px] cursor-pointer gap-4 items-center hover:bg-[#e9f9fa] ${props.state.isActive ? 'bg-[#e9f9fa]' : ''}   `}>
       
       {
        participant.pic ? (<img className='rounded-lg w-[50px] h-[50px]' src={participant.pic}  alt="" />
        ) : (<img className='rounded-lg w-[50px] h-[50px]' src={`https://avatar.oxro.io/avatar.svg?name=${participant.name.split(' ')[0]}+${participant.name.split(' ')[1]}`}  alt="" />
        )
       }
       
      <div>
        <h1 className='font-bold'>{participant.name}</h1>
        <p>{participant.email}</p>
      </div>
    </div>
  );
}


function ChatBox(props) {



  const { t } = useTranslation();
  const [isloading, setIsloading] =useState(false)

  //All conversations
  const [conversation, setConversations] =useState(null)
  //isCLicked
  const [convState, setConvState] =useState(null)
  //activeConversationId
  const [activeConversation, setActiveConversation] =useState(null)
  //OpenConversation
  const [openConversation, setOpenConversation] =useState(null)
  //receiver
  const [receiver, setReciver] =useState(null) 
  //Sender
  //Messages
  const [messages, setMessages]= useState(null)
  //typedMessage
  const [typedMessage, setTypedMessage] = useState('')


  async function sendMessage(convId, senderId){  

    console.log("Type: ", typedMessage)
    console.log("active conv ", activeConversation)
    console.log("send", senderId)

    const { data, error } = await supabase
    .from('message')
    .insert([
      { messageContent: typedMessage,senderId:senderId,conversationId: convId  },
    ])
    .select()
    .single()
    if(error){
      console.log("Error", error)

    }

    if(data){
      console.log("Data Inserted of Message", data)
      setTypedMessage('')
      setMessages(prevMessages => [...prevMessages, data]);
    }
  }


  useEffect(() => {
    if (activeConversation) {
      const updatedConvState = convState.map(item => ({
        ...item,
        isActive: item.conversationId === activeConversation ? true : false
      }));
      setConvState(updatedConvState);
      console.log("updatedState", updatedConvState)
    }
  }, [activeConversation]);

  useEffect(()=>{
    if (activeConversation && conversation) {
      const foundConversation = conversation.find(conv => conv.conversation_id === activeConversation);
      setOpenConversation(foundConversation);
    }

  },[activeConversation, conversation])

  useEffect(()=>{
    console.log("OpenConversation",openConversation)

    async function getreceiver(userId){
      const {data, error} = await supabase
      .from('user')
      .select('*')
      .eq('id', userId)
      .single()

      if(data)
      setReciver(data)

      if(error)
      console.log(error)
    }
  
    if(openConversation){
      if(openConversation.participant1_id!==props.user.id){
        getreceiver(openConversation.participant1_id)
      }
      else if(openConversation.participant2_id!==props.user.id){
        getreceiver(openConversation.participant2_id)
      }
     
    }
  },[openConversation])



  useEffect(() => {
    
    async function getMessages(conversationId){
      const {data, error} = await supabase
      .from('message')
      .select('*')
      .eq('conversationId',conversationId)
  
      if(data)
      {
        setMessages(data)
      }

      if(error)
      console.log(error)
    }
    
    if (openConversation) {
      getMessages(openConversation.conversation_id);
      const interval = setInterval(() => {
        getMessages(openConversation.conversation_id);
      }, 5000); // Fetch messages every 5 seconds
      return () => clearInterval(interval);
    }
  }, [openConversation]);


  useEffect(()=>{
    console.log("active conv : = ", activeConversation)
  },[])

  useEffect(()=>{

    console.log("Messages = > ", messages)
  },[messages])

  useEffect(()=>{
    console.log("receiver",receiver)

  },[receiver])

  useEffect(()=>{
    const fetchConversations = async (userId) => {
        try {
        if (!userId) {
            console.error('Error fetching conversations: User ID is undefined');
            return null;
        }
        const { data, error } = await supabase
            .from('conversationdetails')
            .select(
                `*`
            )
            .or(`participant2_id.eq.${userId},participant1_id.eq.${userId}`)
            .neq('status', 'rejected')

        if (error) {
            console.error('Error fetching conversations:', error.message);
            return null;
        }
    
        console.log('Conversations fetched successfully:', data);
        setConversations(data)
        const initialState = data.map(item => ({
          conversationId: item.conversation_id,
          isActive: false
        }));
        setConvState(initialState);
        return data; // Return fetched conversations
        } catch (error) {
        console.error('Error fetching conversations:', error.message);
        return null;
        }
    };
    fetchConversations(props.user.id)
  },[])


  useEffect(()=>{
    console.log("States = > ", convState)
  },[convState])


  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getLastSeen(timestamp){
    const lastSeen = new Date(timestamp); // Convert timestamp to a Date object
    const now = new Date(); // Get current date and time

    const timeDifference = now - lastSeen; // Difference in milliseconds

    // Convert milliseconds to minutes, hours, or days
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    let formattedLastSeen;

    if (days > 0) {
      formattedLastSeen = `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      formattedLastSeen = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      formattedLastSeen = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    return formattedLastSeen;

  }

  return (
    <div className='w-[82vw] h-full bg-gray-100 p-[30px] flex flex-col gap-5'>
    <div className='flex flex-row justify-between items-center'>
    <h1 className='text-2xl font-bold '>Chat</h1>
    </div>
    <div className='h-[95%]  w-full flex flex-row justify-between flex-wrap gap-2'>
        <div name="ContactBar" className='bg-white w-[30%] h-full rounded-xl shadow-md overflow-y-auto '>  
            {conversation && conversation.length > 0 && conversation.map((conversation,index) => (
              <ConversationComponent 
              key={conversation.id}
              conversation={conversation} 
              myProfile={props.user} 
              Click={setActiveConversation}
              state={convState[index]}
              />
            ))}


        {!conversation   ? 
                    (<div className=' w-full bg-white flex items-center flex-col justify-center h-full'>
                      <div className='loader'></div>
                     
                      
                    </div>) :''}


            {conversation && conversation.length <= 0  ? 
            (<div className='w-full bg-white flex items-center flex-col justify-center h-full'>
              <PiSmileyLight size={70} />
              <h1 className='text-xl text-center'>{t("No Conversation")} <br /> {t("Initiated")}</h1>
              <p className='text-center mt-4 px-[40px]'>{t("To initiate a conversation, go to people's profile and chat with a desired person")}</p>
              
            </div>) :''}
        </div>



    {openConversation  && receiver ? 
    (
      <div className='bg-[#ffffff] w-[68%] h-[100%] rounded-lg shadow-md  flex flex-col'>
      <div className='w-full h-[12%] border-b-2 border-b-gray-200'>
        <div className='flex flex-row w-full p-2 px-[25px] h-full  gap-4 items-center '>
            <div>
              <h1 className='font-bold text-xl text-primary2'>{receiver.name}</h1>
              <div className='flex flex-row gap-2 items-center'>
           
            {
              receiver.isOnline ? (<>
               <div className='w-[10px] h-[10px] bg-green-400 rounded-full'></div>
               <p className='text-sm text-[#6e6e6e]'>{t("Online")}</p>
              </> ) : (
                <>
                <div className='w-[10px] h-[10px] bg-gray-200 rounded-full'></div>
               <p className='text-sm text-[#6e6e6e]'>{t("Offline | Last Seen")}: {getLastSeen(receiver.lastSeen)}</p>
                </>
              )
            }
             
              </div>
            </div>
        </div>
      </div>
      <div className='w-full h-[67%] p-2 flex flex-col gap-2 overflow-y-auto'>
      {messages ? (
        messages.map((message, index) => (
          <Message key={index} message={message} user={props.user} receiver={receiver} convStatus={openConversation.status} />
        ))
      ) : (
        <div className="loader"></div>
      )}
      <div ref={messagesEndRef} />
            




      </div>
      <div className='w-full h-[20%] border-t-2 border-t-gray-100 flex flex-row items-center justify-center gap-3 p-[20px]'>
       <textarea value={typedMessage} onChange={(e)=>{setTypedMessage(e.target.value)}}  name=""  id=""  className='w-[90%] h-full rounded-lg border-2 border-gray-200 p-3' cols="30" rows="10" placeholder='Type...'></textarea>
        <button onClick={()=>{sendMessage(activeConversation, props.user.id)}} className='bg-primary hover:bg-secondary w-[50px] h-[50px] rounded-full flex justify-center items-center'>
        <span class="material-symbols-outlined text-white text-3xl ">
           {t("send")}
        </span>
        </button>
      </div>
      <p>{t("Note: Don't share your personal details if you dont trust the other person.")}</p>
    </div>
    )
    :(<h1 className=''></h1>) }


  </div>
</div>   
  )
}

export default ChatBox
