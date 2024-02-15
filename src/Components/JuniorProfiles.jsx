import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import supabase from '../config/supabaseClient'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../Assets/Spinner/spinner.css'

function JuniorProfiles(props) {


    const [youngProfiles, setYoungProfiles] =useState([])
    const [myDesiredActivities, setMyDesiredActivities] = useState([]);
    const [juniorProfilesArray, setJuniorProfilesArray] =useState([])

    useEffect(() => {
      function highestRating(indoor, outdoor, remote) {
        console.log("Ratings : ", indoor, outdoor, remote);
        const activities = [];
        const smallest = Math.min(indoor, outdoor, remote);
        if (smallest === indoor && indoor <= 2 ) {
            activities.push("Indoor");
        }
        if (smallest === outdoor && outdoor <= 2 ) {
            activities.push("Outdoor");
        }
        if (smallest === remote && remote <= 2 ) {
            activities.push("Remote");
        }
        if (activities.length === 0) {
            activities.push("Indoor", "Outdoor", "Remote");
        }
        console.log("Activ :  -", activities)
        return activities;
    }


      const DesiredActivities = highestRating(props.user.Indoor, props.user.Outdoor, props.user.Remote);
      console.log("MyDesire :", DesiredActivities);
      setMyDesiredActivities(DesiredActivities);
  }, [props.user]);


  useEffect(() => {
    async function getYoung(activity, value) {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('isYoung', true)
            .lte(activity, value)
            .neq('id', props.user.id);
        return { data, error };
    }

    async function fetchData() {
        const promises = myDesiredActivities.map(activity => {
            if (activity === "Indoor") {
                return getYoung("Indoor", props.user.Indoor);
            } else if (activity === "Outdoor") {
                return getYoung("Outdoor", props.user.Outdoor);
            } else if (activity === "Remote") {
                return getYoung("Remote", props.user.Remote);
            }
        });

        const results = await Promise.all(promises);
        results.forEach(({ data, error }) => {
            if (data) {
                console.log(data);
                setYoungProfiles(youngProfiles => [...youngProfiles, ...data]); // Append fetched profiles to existing state
            }
            if (error) {
                console.log(error);
            }
        });
    }

    fetchData();
}, [myDesiredActivities]);



useEffect(() => {
  if (youngProfiles && myDesiredActivities.length > 0) {
      console.log("Young Profiles ==> ", youngProfiles);

      myDesiredActivities.forEach(activity => {
          if (activity === "Indoor") {
              console.log("Inside Activity");
              youngProfiles.forEach(profile => {
                  for (const activity in profile.IndoorActivities) {
                      if (profile.IndoorActivities[activity] && props.user.IndoorActivities[activity]) {
                          console.log("For ", activity);
                          setJuniorProfilesArray(prevProfiles => [
                              ...prevProfiles,
                              { id: profile.id, name: profile.name, email: profile.email, type: "Indoor", activity: activity, pic:profile.profilePic }
                          ]);       
                      }
                  }
              });
          } else if (activity === "Outdoor") {
              console.log("Inside Activity");
              youngProfiles.forEach(profile => {
                  for (const activity in profile.OutdoorActivities) {
                      if (profile.OutdoorActivities[activity] && props.user.OutdoorActivities[activity]) {
                          console.log("For ", activity);
                          setJuniorProfilesArray(prevProfiles => [
                              ...prevProfiles,
                              { id: profile.id, name: profile.name, email: profile.email, type: "Outdoor", activity: activity, pic:profile.profilePic }
                          ]);       
                      }
                  }
              });
          } else if (activity === "Remote") {
              console.log("Inside Activity");
              youngProfiles.forEach(profile => {
                  for (const activity in profile.RemoteActivities) {
                      if (profile.RemoteActivities[activity] && props.user.RemoteActivities[activity]) {
                          console.log("For ", activity);
                          setJuniorProfilesArray(prevProfiles => [
                              ...prevProfiles,
                              { id: profile.id, name: profile.name, email: profile.email, type: "Remote", activity: activity, pic:profile.profilePic }
                          ]);       
                      }
                  }
              });
          }
      });
  }
}, [youngProfiles]);


   useEffect(()=>{
    if(juniorProfilesArray){
        console.log(juniorProfilesArray)
    }
   },[juniorProfilesArray])


   
  const JuniorProfileCard = (props) => {
    
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
    const {id, name, email, type, activity,pic } = props.youngProfile;
    const [isloading, setIsloading] = useState(false)
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
                      .insert([{ participant1: props.myProfile.id, participant2: id, unReadCount: 0 }])
                      .select()
                      .single();
                  if (insertResult.error) {
                      setIsloading(false)
                  } else if(insertResult.data) {
                    handleSuccess('Your msg has been sent')
                    setIsloading(false)
                    console.log('Conversation inserted successfully:', insertResult.data);
                    const messageData = await supabase
                    .from('message')
                    .insert([
                      { messageContent: `
                      <$%activity%$>
                      ${activity}
                      <$%activity%$>
                      <$%name%$>
                      ${name}
                      <$%name%$>
                      <$%type%$>
                      ${type}
                      <$%type%$>
                      `,senderId:props.myProfile.id,conversationId:insertResult.data.id },
                    ])
                    .select()
                    .single()
                    if(messageData.data){
                      handleSuccess('Your message request has been sent')
                      setIsloading(false)
                      console.log('Conversation inserted successfully:', insertResult.data);
                    }

                    else if(messageData.error){
                     handleFailure("Failed to send message request")
                      setIsloading(false)
                      console.log('Conversation inserted successfully:', insertResult.data);
                    }
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


          {
            pic ? (
              <img
            src={pic}
            alt="Profile Avatar"
            className='bg-gray-100 rounded-full w-[50px] h-[50px]'
          />

            ) : (
              <img
            src={`https://avatar.oxro.io/avatar.svg?name=${name.split(' ')[0]}+${name.split(' ')[1]}`}
            alt="Profile Avatar"
            className='bg-gray-100 rounded-full w-[50px] h-[50px]'
          />

            )
          }
          
          <div className='flex flex-col'>
            <h1 className='font-bold text-xl text-primary2'>{name}</h1>
            <p className='text-xs'>{email}</p>
          </div>
        </div>
  
        <h1 className='font-bold text-primary px-3 mt-2'> {type} Activity</h1>
        <p className='px-3 min-h-[60px]'>{activity}</p>
  
        <div className='flex flex-row justify-between px-3 items-center mt-2'>
         
         {!isloading ? (<button onClick={()=>{handleChat()}} className='bg-primary p-2 w-[100px] text-white rounded-full hover:bg-secondary'>Request</button>) : (<div className="loader"></div>)} 
          {/* <p className='font-bold text-3xl text-primary2'>$13.00/-</p> */}
        </div>
      </div>
    );
  };



  return (
    <div className='h-full w-full flex flex-row gap-5 flex-wrap overflow-y-auto'>
    {juniorProfilesArray.length > 0 ? (
       juniorProfilesArray.map((element, index) => (
         <JuniorProfileCard key={index} youngProfile={element} myProfile={props.user} />
       ))
     ) : (
       <h1>No Match Found</h1>
     )}
        
    <ToastContainer />
   </div>
  )
}

export default JuniorProfiles
