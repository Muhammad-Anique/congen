import React, { useEffect, useState } from 'react'
import Field from '../UI/Field'
import supabase from '../config/supabaseClient';
import '../Assets/Spinner/spinner.css'
import { v4 as uuidv4 } from 'uuid';
import { FaPencilAlt } from "react-icons/fa";
function MyProfile(props) {
  
    const [changing, setChanging] =useState(false)
    const [isloading, setIsloading] =useState(false) 
    const [newPassword, setNewPassword] =useState(null)
    const [image, setImage] =useState(props.user.profilePic)

    useEffect(()=>{
        async function getMedia(){
            const userMedia= await supabase
            .from('user')
            .select('*')
            .eq('id', props.user.id)
            .single()
           
            if(userMedia.data)
            setImage(userMedia.data.profilePic)
        }
        getMedia()
      
    },[])
    async function updateUser(email, newPassword) {
        setIsloading(true)
        try {
            const { data, error } = await supabase.auth.updateUser({
                email: email,
                password: newPassword,
            });
            
            if (error) {
                setIsloading(false)
                setChanging(false)
                console.error("Error updating user:", error.message);
                alert("Password Cannot be Updated")
                return { error: error.message };
            } else {
                setIsloading(false)
                setChanging(false)
                console.log("User updated successfully:", data);
                alert("Password updated")
                return { data: data };
            }
        } catch (err) {
            setIsloading(false)
            setChanging(false)
            console.error("Error updating user:", err.message);
            return { error: err.message };
        }
    }
    function calculateAge(dateOfBirth) {
        // Convert the date of birth string to a Date object
        var dob = new Date(dateOfBirth);
        
        // Get the current date
        var currentDate = new Date();
        
        // Calculate the difference in years
        var age = currentDate.getFullYear() - dob.getFullYear();
        
        // Adjust age if the birthday hasn't occurred yet in the current year
        if (currentDate.getMonth() < dob.getMonth() || 
            (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
            age--;
        }
        
        return age;
    }
    
 
    const handleImageChange = async (event) => {

        setIsloading(true)
    const file = event.target.files[0];
    if (!file) return;

    // const fileExt = file.name.split(".").pop();
    // const fileName = `${props.user.id}.${fileExt}`;
    
    const fileName = `${props.user.id}/${uuidv4()}_${file.name.replace(/[^a-z0-9_.-]/gi, '')}`;


    try {
      const { data, error } = await supabase.storage
        .from("congen-images")
        .upload(fileName , file);

      if (error) {
        console.error("Error uploading image:", error.message);
        alert("Image upload failed");
        setIsloading(false)
        return;
      } else {
        console.log("Image uploaded successfully:", data);
        const userUpdated= await supabase
        .from('user')
        .update({ profilePic:`https://zoemdcizzlyylayopyie.supabase.co/storage/v1/object/public/${data.fullPath}`})
        .eq('id', props.user.id)
        .select()
        .single()
        if(data){
            setIsloading(false)
        console.log("Updated : ", data)
        setImage(URL.createObjectURL(file));
        }
        if(error){
            setIsloading(false)
        console.log(error)
        }    
      }
    } catch (err) {
        setIsloading(false)
      console.error("Error uploading image:", err.message);
      alert("Image upload failed");
    }
  };
  return (
    <div className='bg-white w-[95%] rounded-lg flex flex-row items-center shadow-md p-5 gap-3'>
        <div className='relative'>
        {image ? (
          <img src={image} alt="Uploaded" className="rounded-xl h-[150px] w-[150px]" />
        ) : (
          <img
            src={`https://avatar.oxro.io/avatar.svg?name=${props.user.name.split(' ')[0]}+${props.user.name.split(' ')[1]}`}
            alt=""
            className="rounded-xl h-[150px] w-[150px]"
          />
        )}
        {
        isloading ? (<div className='loader absolute right-1 top-1'></div>) : ( <label className="upload-button absolute z-10 right-1 top-1 hover:text-primary3 cursor-pointer bg-white p-2 rounded-full">
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            <FaPencilAlt size={20} />
          </label>)
        }
       
        </div>
        <div className='flex flex-col'>
        <div className='flex flex-row items-center gap-3'>
            <h1 className='font-bold text-lg'>Full Name: </h1>
            <h1 className='text-lg border-2 rounded-full  px-3 text-primary2'>{props.user.name}</h1>
        </div>
        <div className='flex flex-row items-center gap-3'>
            <h1 className='font-bold text-lg'>Age: </h1>
            <h1 className='text-lg border-2 rounded-full  px-3 text-primary2'>{ calculateAge(props.user.dob)}</h1>
        </div>

        <div className='flex flex-row items-center gap-3'>
            <h1 className='font-bold text-lg'>Date of Birth: </h1>
            <h1 className='text-lg border-2 rounded-full px-3 text-primary2'>{(props.user.dob)}</h1>
        </div>

        <div className='flex flex-row items-center gap-3 mt-2'>
            {
                !changing ? (            <button onClick={()=>{setChanging(true)}} className='text-lg p-1 border-2 rounded-md hover:bg-primary2 px-3 text-primary2  hover:text-white'>change password</button>
                ) : ( 
                    <>   <h1 className='font-bold text-lg'>New Password</h1>
                    <input type={`password`} className=' px-2 py-1 w-[300px] h-[40px] rounded-md border border-gray-400' value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}} />
                     {
                        isloading ? (<div className='loader'></div>) : (                    <button onClick={()=>{updateUser(props.email, newPassword)}} className='text-lg p-1 border-2 rounded-md hover:bg-primary2 px-3 text-primary2 hover:text-white'>update password</button>
                        )
                     }
                  
                    </>
                )
            }
           
        </div>
        

        </div>
     
      
    </div>
  )
}

export default MyProfile
