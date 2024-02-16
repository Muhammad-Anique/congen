import React, { useEffect, useState } from 'react'
import logo from '../Assets/logo.jpg'
import { useDispatch, useSelector } from 'react-redux'
import './checkbox.css'

import JuniorProfiles from '../Components/JuniorProfiles'
import ChatBox from '../Components/ChatBox'
import { FiMessageSquare } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";

import { FiUsers } from "react-icons/fi";
import { setOldDashboardSlice } from '../store/slices/oldDashboardSlice'
import { setNavigation } from '../store/slices/navigationSlice'
import supabase from '../config/supabaseClient'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUser } from '../store/slices/userSlice'
import MyProfile from '../Components/MyProfile'

import { useTranslation } from 'react-i18next';

function OldDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [user, setUser_] =useState(useSelector((state)=>{ return state.user.data }))


  function Page(){

    const [isloading, setIsloading] =useState(false)
    
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


    const data = useSelector((state)=>{ return state.oldDashboard.data })
    const [activity, setActivity] = useState({
      "Indoor": {
        "rating":[false, false, false],
        "preferredActivities":[
          { "Basic computer course: Teaching seniors how to use a computer or smartphone": false,
          "Cooking lessons: Teaching them to cook simple and healthy dishes.": false,
          "Language exchange: Practicing foreign languages together through conversations.": false,
          "Shared reading: Reading books or articles together and discussing them.": false,
          "Artistic and craft activities: Creating artistic projects together such as painting, drawing, or crafts.": false,
          "Music lessons: Teaching to play an instrument or singing together.": false,
          "Card games or board games: Organizing card games or board games for fun together.": false,
          "Storytelling activities: Sharing life stories and personal experiences.": false,
          "Guided tastings of wines or foods, where each participant brings something to share.": false
           }
        ]
      },
      "Outdoor":{
        "rating":[false, false, false],
        "preferredActivities":[
          {  "Park walks: Enjoying nature and taking a walk together in the park.": false,
          "Visits to museums or art exhibitions: Exploring artworks and culture together.": false,
          "Visits to local markets: Exploring local markets or fairs.": false,
          "Photography passion: Organizing an outdoor photo session to capture special moments.": false,
          "Cinema passion: Participating in a movie night by watching one of your favorite films.": false,
          "Sports with professionals: Participating in fitness sessions to stay fit at our affiliated facilities and avail exceptional discounts.": false,
          "Community volunteer activities.": false
           }
        ]    
      },
      "Remote":{
        "rating":[false, false, false],
        "preferredActivities":[
          {"Video calls: Making video calls to connect and converse.": false,
          "Voice calls: Making voice calls to connect and converse.": false}
        ]
      }
    })

    const [user, setUser_] =useState(useSelector((state)=>{ return state.user.data }))

    const handleRatingChange = (type, index) => {
      const updatedActivity = { ...activity };
      updatedActivity[type].rating = updatedActivity[type].rating.map((value, idx) => idx === index);
      setActivity(updatedActivity);
    };
      const handlePreferredActivityChange = (type, activityName) => {
      setActivity(prevActivity => {
        const updatedActivity = { ...prevActivity };
        updatedActivity[type].preferredActivities[0] = {
          ...updatedActivity[type].preferredActivities[0],
          [activityName]: !updatedActivity[type].preferredActivities[0][activityName]
        };
        return updatedActivity;
      });
    };
    
    useEffect(() => {
      const updatedActivity = { ...activity };
      updatedActivity["Indoor"].rating[user["Indoor"] - 1] = true;
      updatedActivity["Outdoor"].rating[user["Outdoor"] - 1] = true;
      updatedActivity["Remote"].rating[user["Remote"] - 1] = true;
      updatedActivity["Indoor"].preferredActivities[0] = user.IndoorActivities;
      updatedActivity["Outdoor"].preferredActivities[0] = user.OutdoorActivities;
      updatedActivity["Remote"].preferredActivities[0] = user.RemoteActivities;
      setActivity(updatedActivity)    
    }, [user]);

    useEffect(()=>{
      console.log(activity)
    },[activity])
   
    console.log("data " ,data);

    
  function getTrueRatingIndex(activity) {
    const index = activity.rating.findIndex(value => value === true);
    return index !== -1 ? index + 1 : null; // Adding 1 to match the index in your array
  }

  async function  updateProfile(){

    setIsloading(true)
    const Indoor_ = activity.Indoor;
    const Outdoor_ = activity.Outdoor;
    const Remote_ = activity.Remote;
    const IndoorActivities = Indoor_.preferredActivities[0]
    const OutdoorActivities = Outdoor_.preferredActivities[0]
    const RemoteActivities  = Remote_.preferredActivities[0]
    const Indoor = getTrueRatingIndex(Indoor_);
    const Outdoor = getTrueRatingIndex(Outdoor_);
    const Remote = getTrueRatingIndex(Remote_);

    
    const { data, error } = await supabase
    .from('user')
    .update({ Indoor:Indoor,Outdoor:Outdoor, Remote:Remote, IndoorActivities: IndoorActivities,
      OutdoorActivities:OutdoorActivities,RemoteActivities:RemoteActivities})
    .eq('id', user.id)
    .select()
    .single()

    if(data){
      setIsloading(false)
      handleSuccess("profile updated")
      console.log("Profile Update _ o  = > ", data)
      dispatch(setUser(data))
    }

    if(error){
      setIsloading(false)
      handleFailure("Profile is not updated")
      console.log("Profile cannot be updated")
    }
          
  }
    if(data==0){
      return(
        <div className='w-[82vw] bg-gray-100 p-[50px] pb-5 flex flex-col gap-10'>
        <div className='flex flex-row justify-between items-center'>
        <h1 className='text-4xl font-bold '>{t("My Profile")}</h1>
        <div className=' w-auto px-[15px] py-[10px] h-[40px] bg-white rounded-full flex items-center justify-center'>
          <p className='font-medium'>{user.email}</p>
        </div>
        <h1 className='font-bold'>{user.name}</h1>
  
        </div>
       
  
        <div className='h-full w-full flex flex-row justify-between flex-wrap overflow-y-scroll gap-8'>
        <MyProfile user={user}/>
        <div name="ActivityIndoor" className='w-full h-auto flex gap-7 flex-row items-center '>
          <div className='bg-white rounded-xl shadow-md w-[400px]  h-[230px] flex gap-7 flex-col items-center justify-center'>
            <h1 className='font-bold text-xl text-[#4b4b4b]'>{t("Indoor Activity")}</h1>
            <div className='flex flex-col w-full px-[30px]'>
              <div className='flex w-full flex-row justify-between items-center radio-wrapper'>
              <p>{t("Want to do")}</p>
                <div>
                  <input type="radio" name="wantToDo1" checked={activity["Indoor"].rating[0]} onChange={() => handleRatingChange("Indoor", 0)} />
                </div>
              </div>
              <div className='flex flex-row justify-between items-center gap-7 radio-wrapper'>
              <p>{t("Doable")}</p>
                <div>
                  <input type="radio" name="doable1" checked={activity["Indoor"].rating[1]} onChange={() => handleRatingChange("Indoor", 1)} />
                </div>
              </div>
              <div className='flex flex-row justify-between items-center gap-7 radio-wrapper'>
              <p>{t("Barely doable")}</p>
                <div>
                  <input type="radio" name="barelyDoable1" checked={activity["Indoor"].rating[2]} onChange={() => handleRatingChange("Indoor", 2)} />
                </div>
              </div>
            </div>
          </div>

          <div className='w-full p-4 rounded-lg h-full flex flex-row flex-wrap gap-2 overflow-y-auto'>
            {Object.entries(activity["Indoor"].preferredActivities[0]).map(([activityName, checked], index) => (
              <div className='bg-white w-auto max-w-[100%] max-h-[80px] h-auto rounded-xl flex flex-row justify-center items-center p-2 border-2 border-primary gap-3 checkbox-wrapper' key={index}>
                <input type="checkbox" checked={checked} onChange={() => handlePreferredActivityChange("Indoor", activityName)} />
                <p>{t(`${activityName}`)}</p>
              </div>
            ))}
          </div>
        </div>

  

        <div name="ActivityOutdoor" className='w-full h-auto flex gap-7 flex-row items-center '>
          <div className='bg-white rounded-xl shadow-md w-[400px]  h-[230px] flex gap-7 flex-col items-center justify-center'>
            <h1 className='font-bold text-xl text-[#4b4b4b]'>{t("Outdoor Activity")}</h1>
            <div className='flex flex-col w-full px-[30px]'>
              <div className='flex w-full flex-row justify-between items-center radio-wrapper'>
              <p>{t("Want to do")}</p>
                <div>
                  <input type="radio" name="wantToDo2" checked={activity["Outdoor"].rating[0]} onChange={() => handleRatingChange("Outdoor", 0)} />
                </div>
              </div>
              <div className='flex flex-row justify-between items-center gap-7 radio-wrapper'>
              <p>{t("Doable")}</p>
                <div>
                  <input type="radio" name="doable2" checked={activity["Outdoor"].rating[1]} onChange={() => handleRatingChange("Outdoor", 1)} />
                </div>
              </div>
              <div className='flex flex-row justify-between items-center gap-7 radio-wrapper'>
              <p>{t("Barely doable")}</p>
                <div>
                  <input type="radio" name="barelyDoable2" checked={activity["Outdoor"].rating[2]} onChange={() => handleRatingChange("Outdoor", 2)} />
                </div>
              </div>
            </div>
          </div>

          <div className='w-full p-4 rounded-lg h-full flex flex-row flex-wrap gap-2 overflow-y-auto'>
            {Object.entries(activity["Outdoor"].preferredActivities[0]).map(([activityName, checked], index) => (
              <div className='bg-white w-auto max-w-[100%] max-h-[80px] h-auto rounded-xl flex flex-row justify-center items-center p-2 border-2 border-primary3 gap-3 checkbox-wrapper' key={index}>
                <input type="checkbox" checked={checked} onChange={() => handlePreferredActivityChange("Outdoor", activityName)} />
                <p>{t(`${activityName}`)}</p>
              </div>
            ))}
          </div>
        </div>


        <div name="ActivityRemote" className='w-full h-auto flex gap-7 flex-row items-center  '>
          <div className='bg-white rounded-xl shadow-md w-[400px] h-[230px] flex gap-7 flex-col items-center justify-center'>
            <h1 className='font-bold text-xl text-[#4b4b4b]'>{t("Remote Activity")}</h1>
            <div className='flex flex-col w-full px-[30px]'>
              <div className='flex w-full flex-row justify-between items-center radio-wrapper'>
              <p>{t("Want to do")}</p>
                <div>
                  <input type="radio" name="wantToDo3" checked={activity["Remote"].rating[0]} onChange={() => handleRatingChange("Remote", 0)} />
                </div>
              </div>
              <div className='flex flex-row justify-between items-center gap-7 radio-wrapper'>
              <p>{t("Doable")}</p>
                <div>
                  <input type="radio" name="doable3" checked={activity["Remote"].rating[1]} onChange={() => handleRatingChange("Remote", 1)} />
                </div>
              </div>
              <div className='flex flex-row justify-between items-center gap-7 radio-wrapper'>
              <p>{t("Barely doable")}</p>
                <div>
                  <input type="radio" name="barelyDoable3" checked={activity["Remote"].rating[2]} onChange={() => handleRatingChange("Remote", 2)} />
                </div>
              </div>
            </div>
          </div>

          <div className='w-full p-4 rounded-lg h-full flex flex-row flex-wrap gap-2 '>
            {Object.entries(activity["Remote"].preferredActivities[0]).map(([activityName, checked], index) => (
              <div className='bg-white w-auto max-w-[90%] max-h-[80px] h-auto rounded-xl flex flex-row justify-center items-center p-2 border-2 border-primary gap-3 checkbox-wrapper' key={index}>
                <input type="checkbox" checked={checked} onChange={() => handlePreferredActivityChange("Remote", activityName)} />
                <p>{t(`${activityName}`)}</p>
              </div>
            ))}
          </div>
        </div>


        { isloading  ? (<div className='loader'></div> ) : (      <button  onClick={()=>{updateProfile()}} className='w-[260px] h-[50px] bg-primary rounded-lg hover:bg-secondary text-primary2 text-xl self-center'>Update Profile</button>
       )}    
      </div>
      <ToastContainer />
    </div>          
      )
    }
    
    else if(data==1){
      return(
        <div className='w-[82vw] bg-gray-100 p-[50px] flex flex-col gap-10'>
        <div className='flex flex-row justify-between items-center'>
        <h1 className='text-4xl font-bold '>{t("Junior Profiles")}</h1>
        <div className='min-w-[240px] w-auto px-[15px] py-[10px] h-[40px] bg-white rounded-full flex items-center justify-center'>
          <p className='font-medium'>{user.email}</p>
        </div>
        <h1 className='font-bold'>{user.name}</h1>
        </div>
        <JuniorProfiles user={user}/>
        </div>    
      )
    }
    
    else if(data==2){
      return(
        <ChatBox user={user}/>
      )
    }




  }

  

  const updateUser = async (userId) => {
    const now = new Date();
    console.log("Now; ",now)
    const lastSeenTimestamp = now.toISOString();
    console.log("The id = >", userId)
    const { data, error } = await supabase
    .from('user')
    .update({ isOnline: false ,lastSeen:now})
    .eq('id', userId)
    .select()
    .single()
    if(data){
      console.log("Updated : ", data)
      let { error } = await supabase.auth.signOut()
      return data
    }
    if(error){
      console.log(error)
      return null
    }    
  };

  return (
   <div className='bg-blue-400 flex flex-row w-[100vw] overflow-hidden h-screen'>
    <nav className='w-[18vw] bg-white h-full flex flex-col gap-[20px] px-[20px] py-[40px] justify-between'>
      <div className='flex flex-col gap-5'>
      <div className='flex flex-row gap-1 justify-center items-center  '>
      <img src={logo} className='w-[50px] h-[50px]' alt="" />
      <button className='w-[120px] h-[80px] text-2xl text-gray-800 font-bold'>Congen</button>
      
      </div>
      <div className='flex flex-col  gap-5'>
        <div onClick={()=>{dispatch(setOldDashboardSlice(0))}} className='flex flex-row items-center gap-3 bg-gray-100 text-black px-[15px] hover:bg-primary hover:cursor-pointer hover:text-white rounded-sm  py-[10px]'>
        <FiUser size={20}/>
        <button className=' text-lg'>{t("My Profile")}</button>
        </div>

        <div  onClick={()=>{dispatch(setOldDashboardSlice(1))}}  className='flex flex-row items-center gap-3 bg-gray-100 px-[15px] rounded-sm hover:bg-primary hover:cursor-pointer hover:text-white py-[10px]'>
        <FiUsers size={20} />
        <button className=' text-lg'>{t("Junior's Profiles")}</button>
        </div>

        <div  onClick={()=>{dispatch(setOldDashboardSlice(2))}}  className='flex flex-row items-center gap-3 bg-gray-100 px-[15px] rounded-sm hover:bg-primary hover:cursor-pointer hover:text-white  py-[10px]'>
        <FiMessageSquare size={20} />
        <button className=' text-lg'>{t("Messages")}</button>
        </div>

      </div>
      </div>
    
       <div onClick={()=>{dispatch(setOldDashboardSlice(0)); dispatch(setNavigation(0));window.location.href = 'https://congen.it'; updateUser(user.id)}}  className='flex flex-row items-center gap-3 bg-gray-100 px-[15px] rounded-sm hover:bg-primary hover:cursor-pointer hover:text-white  py-[10px]'>
       <FiLogOut size={20} />
        <button   className=' text-lg'>{t("LogOut")}</button>
        </div>     
    </nav> 

   <Page/>
   </div>
  )
}

export default OldDashboard
