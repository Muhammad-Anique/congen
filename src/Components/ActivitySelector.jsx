import React, { useState } from 'react'

function ActivitySelector() {

  const [activity, setActivity] = useState({
    "Indoor": {
      "isActive": true,
      "rating":[false, false, false],
      "preferredActivities":[
        { "activity1" : false,
        "activity2" : false,
        "activity3" : false,
        "activity4" : false,
        "activity5" : false,
        "activity6" : false,
        "activity7" : false}
      ]

    },
    "Outdoor":{
      "isActive": false,
      "rating":[false, false, false],
      "preferredActivities":[
        { "activity1" : false,
          "activity2" : false,
          "activity3" : false,
          "activity4" : false,
          "activity5" : false,
          "activity6" : false,
          "activity7" : false}
      ]

    },
    "Remote":{
      "isActive": false,
      "rating":[false, false, false],
      "preferredActivities":[
        { "activity1" : false,
        "activity2" : false,
        "activity3" : false,
        "activity4" : false,
        "activity5" : false,
        "activity6" : false,
        "activity7" : false}
      ]
    }
  })


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
                  checked={activity[Object.keys(activity).find(type => activity[type].isActive)].preferredActivities.includes(index)}
                  onChange={() => {
                    const newPreferredActivities = [...activity[Object.keys(activity).find(type => activity[type].isActive)].preferredActivities];
                    const indexOfActivity = newPreferredActivities.indexOf(index);

                    if (indexOfActivity !== -1) {
                      // If index exists in the array, remove it
                      newPreferredActivities.splice(indexOfActivity, 1);
                    } else {
                      // If index doesn't exist in the array, add it
                      newPreferredActivities.push(index);
                    }

                    setActivity(prevActivity => ({
                      ...prevActivity,
                      [Object.keys(prevActivity).find(type => prevActivity[type].isActive)]: {
                        ...prevActivity[Object.keys(prevActivity).find(type => prevActivity[type].isActive)],
                        preferredActivities: newPreferredActivities,
                      },
                    }));
                  }}
                />
                <p>Indoor Activity {index + 1}</p>
              </div>
            ))}
          </div>


        <button className='w-[360px] h-[45px] mt-[24px] bg-primary hover:bg-[#66aebd] text-white font-bold text-xl rounded-xl'>Next</button>
    </div>
  )
}

export default ActivitySelector
