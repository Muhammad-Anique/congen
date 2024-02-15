import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import supabase from '../config/supabaseClient';
import { act } from 'react-dom/test-utils';
import { useDispatch } from 'react-redux';
import { setNavigation } from '../store/slices/navigationSlice';


import '../Assets/Spinner/spinner.css'

function ActivitySelector(props) {
  const [isloading, setIsloading] =useState(false)
  const dispatch =useDispatch()
  const navigate = useNavigate()
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
  console.log("Prop.data = ", props.Data)
  const [activity, setActivity] = useState({
    "Indoor": {
      "isActive": true,
      "rating":[false, false, false],
      "preferredActivities":[
        { "Craft workshops such as ceramics, knitting, or painting." : false,
        "Book clubs or literary discussion groups." : false,
        "Movie or documentary nights with group discussions." : false,
        "Wellness activities" : false,
        "DIY or home improvement courses for small domestic projects." : false,
        "Guided tastings of wines or foods, where each participant brings something to share" : false,
         }
      ]

    },
    "Outdoor":{
      "isActive": false,
      "rating":[false, false, false],
      "preferredActivities":[
        { "Nature trekking on marked trails." : false,
          "Guided tours to museums or historical sites." : false,
          "Participation in clubs or interest groups such as photography, birdwatching, or stargazing." : false,
          "Community volunteer activities, such as park clean-ups or participation in environmental projects." : false,
          "Gardening or horticulture courses in community spaces." : false,
         }
      ]
      
    },
    "Remote":{
      "isActive": false,
      "rating":[false, false, false],
      "preferredActivities":[
        { "Call" : false,
        "Videocalls" : false,
        "Webinars or online conferences on general or specific topics of interest." : false,
        "Online study or reading groups." : false,
        "Participation in online group games, like quizzes or strategy games." : false,
        "Online fitness or yoga sessions for groups." : false,
        "Virtual clubs, like a movie club where a film is watched separately and then discussed together online." : false}
      ]
    }
  })




  function getTrueRatingIndex(activity) {
    const index = activity.rating.findIndex(value => value === true);
    return index !== -1 ? index + 1 : null; // Adding 1 to match the index in your array
  }
  function isActivityActive(activityType) {
    return activity[activityType].isActive;
  }
   
  function toggleActivity(activityType) {
    setActivity((prevActivity) => {
      const updatedActivity = {};
      
      // Set the specified activityType to true and others to false
      Object.keys(prevActivity).forEach((type) => {
        updatedActivity[type] = {
          ...prevActivity[type],
          isActive: type === activityType,
        };
      });
  
      return updatedActivity;
    });
  }

  
  const handleSubmit = async (e) => {   
    setIsloading(true)
    try {
    
   
      console.log("---->",props.Data, activity) 

      const name = props.Data.name;
      const email = props.Data.email;
      const password = props.Data.password;
      const contactNo = props.Data.contactNo;
      const dob = props.Data.dob;
      const isYoung= props.isYoung;
      const isOld=props.isOld;
      const Indoor_ = activity.Indoor;
      const Outdoor_ = activity.Outdoor;
      const Remote_ = activity.Remote;
      const IndoorActivities = Indoor_.preferredActivities[0]
      const OutdoorActivities = Outdoor_.preferredActivities[0]
      const RemoteActivities  = Remote_.preferredActivities[0]
      const Indoor = getTrueRatingIndex(Indoor_);
      const Outdoor = getTrueRatingIndex(Outdoor_);
      const Remote = getTrueRatingIndex(Remote_);

         
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if(data){
      console.log("wdiemwd" , data)
      const uuid = data.user.id
      const userAdded = await supabase
      .from('user')
      .insert([
        {uuid: uuid , name:name,email:email,isYoung:isYoung, isOld: isOld,contact:contactNo,dob:dob,Indoor:Indoor,Outdoor:Outdoor,
           Remote:Remote, IndoorActivities: IndoorActivities,OutdoorActivities:OutdoorActivities,RemoteActivities:RemoteActivities},
      ])
      .select() 
      if(userAdded.data){
        console.log(data)
        handleSuccess("Verification email has sent")
        setIsloading(false)
        setTimeout(() => {
          dispatch(setNavigation(0))
        }, 1000);

      }
      if(userAdded.error){
        console.log(error)
        handleFailure("SignUp Failed")
        setIsloading(false)
      }
    }
    else if(error){
      console.log("wdiemwd" , error)
      console.log(error)
    }
    
    } catch (error) {
      setIsloading(false)
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };
  return (
    <div className='flex flex-col justify-center  gap-[12px]'>
        <p className='text-lg text-gray-500 font-bold'>Select Activity Type</p>
        <div className='flex flex-row items-center'>
    
        <button onClick={()=>{toggleActivity("Indoor")}} className={`border-2 p-2 border-primary w-[110px] text-xl hover:bg-primary hover:font-bold hover:text-white ${isActivityActive("Indoor") ? "bg-primary text-white font-bold" : ""}`}>Indoor</button>
        <button onClick={()=>{toggleActivity("Outdoor")}} className={`ml-3 border-2 p-2 border-primary w-[110px] text-xl hover:bg-primary hover:font-bold hover:text-white ${isActivityActive("Outdoor") ? "bg-primary text-white font-bold" : ""}`}>Outdoor</button>
        <button onClick={()=>{toggleActivity("Remote")}} className={`ml-3 border-2 p-2 border-primary w-[110px] text-xl hover:bg-primary hover:font-bold hover:text-white ${isActivityActive("Remote") ? "bg-primary text-white font-bold" : ""}`}>Remote</button>

        </div>
        <p className='text-lg text-gray-500 font-bold'>Rate {Object.keys(activity).find(type => activity[type].isActive)} Activity</p>
          <div className='flex flex-col'>
            {activity[Object.keys(activity).find(type => activity[type].isActive)].rating.map((isChecked, index) => (
              <div key={index} className='flex flex-row justify-between items-center'>
                <p>{index === 0 ? 'Want to do' : index === 1 ? 'Doable' : 'Barely Doable'}</p>
                <input
                  type="radio"
                  name="ratingGroup"
                  checked={isChecked}
                  onChange={() => {
                    const newRating = [...activity[Object.keys(activity).find(type => activity[type].isActive)].rating];
                    newRating.fill(false);
                    newRating[index] = true;
                    setActivity(prevActivity => ({
                      ...prevActivity,
                      [Object.keys(prevActivity).find(type => prevActivity[type].isActive)]: {
                        ...prevActivity[Object.keys(prevActivity).find(type => prevActivity[type].isActive)],
                        rating: newRating,
                      },
                    }));
                  }}
                />
              </div>
            ))}
          </div>



          <p className='text-lg text-gray-500 font-bold'>Select {Object.keys(activity).find(type => activity[type].isActive)} Activity</p>
          <div className='flex flex-col h-[200px] overflow-y-scroll gap-3 px-[10px] '>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className='flex flex-row gap-2 border-2 rounded-lg p-3 border-primary'>
              <input
                type="checkbox"
                checked={activity[Object.keys(activity).find(type => activity[type].isActive)].preferredActivities[0][Object.keys(activity[Object.keys(activity).find(type => activity[type].isActive)].preferredActivities[0])[index]]}
                onChange={() => {
                  const newPreferredActivities = [...activity[Object.keys(activity).find(type => activity[type].isActive)].preferredActivities];
                  const key = Object.keys(activity[Object.keys(activity).find(type => activity[type].isActive)].preferredActivities[0])[index];
                  const indexOfActivity = newPreferredActivities[0][key];

                  newPreferredActivities[0][key] = !indexOfActivity;

                  setActivity(prevActivity => ({
                    ...prevActivity,
                    [Object.keys(prevActivity).find(type => prevActivity[type].isActive)]: {
                      ...prevActivity[Object.keys(prevActivity).find(type => prevActivity[type].isActive)],
                      preferredActivities: newPreferredActivities,
                    },
                  }));
                }}
              />
              <p className='max-w-[250px] h-auto'>{Object.keys(activity[Object.keys(activity).find(type => activity[type].isActive)].preferredActivities[0])[index]}</p>
            </div>
          ))}
        </div>
        <div className='flex flex-row justify-between gap-3'>
        {
          isloading ? (<div className='loader'></div>) : (<button onClick={()=>{handleSubmit()}} className='w-full h-[45px] mt-[24px] bg-primary hover:bg-[#66aebd] text-white font-bold text-xl rounded-xl'>SignUp</button>
          ) 
        }
        </div>
        
    <ToastContainer />

    </div>
  )
}

export default ActivitySelector
