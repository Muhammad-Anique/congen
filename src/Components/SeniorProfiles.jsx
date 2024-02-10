import React, { useEffect, useState } from 'react'
import supabase from '../config/supabaseClient'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../Assets/Spinner/spinner.css'

function SeniorProfiles(props) {

    const [oldProfiles, setOldProfiles] =useState(null)
    const [myDesiredActivity, setMyDesiredAcitivty] =useState(null)
    const [seniorProfilesArray, setSeniorProfilesArray] =useState([])

   useEffect(()=>{
    function highestRating(indoor, outdoor, remote) {
        console.log("Ratings : ", indoor, outdoor, remote)
        const smallest = Math.min(indoor, outdoor, remote);
        if (smallest === indoor) {
            return "Indoor";
        } else if (smallest === outdoor) {
            return "Outdoor";
        } else {
            return "Remote";
        }
    }

    const DesiredActivity = highestRating(props.user.Indoor, props.user.Outdoor, props.user.Remote)
    console.log("MyDesire :",DesiredActivity)
    setMyDesiredAcitivty(DesiredActivity)
   },[])


   useEffect(()=>{
    async function getOld(activity, value){
        const {data, error} =await supabase
        .from('user')
        .select('*')
        .eq('isOld', true)
        .lte(activity, value)
        .neq('id',props.user.id)
        if(data){
             console.log(data)
             setOldProfiles(data)
        }
        if(error){
            console.log(error)
        }
    }

    if(myDesiredActivity==="Indoor"){
      getOld("Indoor",props.user.Indoor)      
    }else if(myDesiredActivity==="Outdoor"){
      getOld("Outdoor",props.user.Outdoor)
    }else if(myDesiredActivity==="Remote"){
      getOld("Remote",props.user.Remote)
    }

   },[myDesiredActivity])








   useEffect(()=>{
    if(oldProfiles)
    {
        console.log("Old Profiles ==> ", oldProfiles)
        if(myDesiredActivity){
        if(myDesiredActivity=="Indoor"){
            console.log("Inside Activity")
            oldProfiles.forEach(profile => {
                for (const activity in profile.IndoorActivities) {
                    if (profile.IndoorActivities[activity]) {
                        console.log("For ", activity);
                        setSeniorProfilesArray(prevProfiles => [
                            ...prevProfiles,
                            { id:profile.id,name: profile.name, email: profile.email, type: "Indoor", activity: activity}
                        ]);       
                    }
                }
            });
        }
        else if(myDesiredActivity=="Outdoor"){
          console.log("Inside Activity")
          oldProfiles.forEach(profile => {
              for (const activity in profile.OutdoorActivities) {
                  if (profile.OutdoorActivities[activity]) {
                      console.log("For ", activity);
                      setSeniorProfilesArray(prevProfiles => [
                          ...prevProfiles,
                          { id:profile.id, name: profile.name, email: profile.email, type: "Outdoor", activity: activity }
                      ]);       
                  }
              }
          });

        }
        else if(myDesiredActivity==""){
          console.log("Inside Activity")
          oldProfiles.forEach(profile => {
              for (const activity in profile.RemoteActivities) {
                  if (profile.RemoteActivities[activity]) {
                      console.log("For ", activity);
                      setSeniorProfilesArray(prevProfiles => [
                          ...prevProfiles,
                          {  id:profile.id,name: profile.name, email: profile.email, type: "Remote", activity: activity }
                      ]);       
                  }
              }
          });
        }
    }
    }
    
   

   },[oldProfiles])


   useEffect(()=>{
    if(seniorProfilesArray){
        console.log(seniorProfilesArray)
    }
   },[seniorProfilesArray])


   
  const SeniorProfileCard = (props) => {
    const {id, name, email, type, activity } = props.oldProfile;
    const [isloading,setIsloading] =useState(false)
    
    const handleSuccess = (msg) => {
      toast.success(msg, {
        position: "top-right",
        autoClose: 3000, // Close the notification after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    const handleFailure = (msg) => {
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

     async function handleChat(){
      console.log("Chat Clicked")
      setIsloading(true)
      try {     
          const { data, error } = await supabase
          .from('conversation')
          .select('*')
          .filter('participant1', 'in', `(${props.myProfile.id},${id})`)
          .filter('participant2', 'in', `(${props.myProfile.id},${id})`)
          if (error) {
              setIsloading(false)
          } else if(data) {
              if (data && data.length > 0) {
                setIsloading(false)
                handleSuccess('Msg Already sent')
                console.log('Conversation already exists:', data);
              } else {
                  // Conversation does not exist, proceed with insertion
                  const insertResult = await supabase
                      .from('conversation')
                      .insert([{ participant1: props.myProfile.id, participant2: id, unReadCount: 0 }]);
                  if (insertResult.error) {
                      setIsloading(false)
                  } else {
                    handleSuccess('Your msg has been sent')
                    setIsloading(false)
                      console.log('Conversation inserted successfully:', insertResult.data);
                  }
              }
          }   
        
      } catch (error) {
        console.log(error)
        setIsloading(false)
        
      }
    }


    return (
      <div className='bg-white rounded-xl w-[360px] h-[260px] shadow-md flex gap-2 p-6 py-[30px] flex-col justify-center'>
        <div className='flex flex-row w-full px-4  gap-[20px] items-center'>
          <img
            src={`https://avatar.oxro.io/avatar.svg?name=${name.split(' ')[0]}+${name.split(' ')[1]}`}
            alt="Profile Avatar"
            className='bg-gray-100 rounded-full w-[50px] h-[50px]'
          />
          <div className='flex flex-col'>
            <h1 className='font-bold text-xl text-primary2'>{name}</h1>
            <p>{email}</p>
          </div>
        </div>
  
        <h1 className='font-bold text-primary px-3 mt-2'> {type} Activity</h1>
        <p className='px-3 min-h-[60px]'>{activity}</p>
  
        <div className='flex flex-row justify-between px-3 items-center mt-2'>
          <button onClick={()=>{handleChat()}} className='bg-primary p-2 w-[100px] text-white rounded-full hover:bg-secondary'>Chat</button>
        </div>
      </div>
    );
  };







  return (
    <div className='h-full w-full flex flex-row gap-5 flex-wrap overflow-y-auto'>
   {seniorProfilesArray.length > 0 ? (
      seniorProfilesArray.map((element, index) => (
        <SeniorProfileCard key={index} oldProfile={element} myProfile={props.user} />
      ))
    ) : (
      <h1>No Match Found</h1>
    )}
      <ToastContainer />
  </div>
  )
}

export default SeniorProfiles
