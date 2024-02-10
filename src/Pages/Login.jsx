import React, { useState } from 'react'
import logo from '../Assets/logo.jpg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import img1 from '../Assets/1.jpg'
import Field from '../UI/Field';
import { useDispatch } from 'react-redux';
import { setNavigation } from '../store/slices/navigationSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import supabase from '../config/supabaseClient';
import { setUser } from '../store/slices/userSlice';



function Login() {
 
  const dispatch =useDispatch()

  const [email, setEmail] =useState('')
  const [password, setPassword] =useState('')


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

  function handleChange1(e){
    setEmail(e.target.value)
  }

  function handleChange2(e){
    setPassword(e.target.value)
  }

 
  const updateUser = async (userId) => {
    const now = new Date();
    console.log("The id = >", userId)
    const { data, error } = await supabase
    .from('user')
    .update({ isOnline: true })
    .eq('id', userId)
    .select()
    .single()
    if(data){
      console.log("Updated : ", data)
      return data
    }
    if(error){
      console.log(error)
      return null
    }    
  };

  async function handleLogin() {
    if (email && password) {
      const formData = {
        email: email,
        password: password,
      };
      try {  
        const { data, error } = await supabase
          .from('user')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .single(); // Assuming email is unique
      
        if (error) {
          handleFailure("User Not Exist or Network Error");
          console.error('Supabase error:', error);
        } else if (data) {
          console.log("User found:", data);
          const up = await updateUser(data.id)
          console.log("Up", up)
          dispatch(setUser(up))
          if(up.isYoung){
            dispatch(setNavigation(2))
          }else if(up.isOld){
            dispatch(setNavigation(3))
          }
         
        } else {
          handleFailure("No user found with the provided credentials");
        }
      } catch (error) {
        handleFailure("Error occurred during login");
        console.error('Unexpected error:', error);
      }
    } else {
      handleFailure("Email and Password Required") ;
    }
  }

  return (
    <div className='w-full h-full bg-[#ffffff] flex flex-row justify-center items-center '>
    <div className='w-[40%] h-full bg-white flex flex-col justify-center items-center gap-[40px]'>
      <div className='flex flex-col justify-center items-center gap-3'>
      <img src={logo} className='h-[120px] w-[120px]' alt="" />
      <p  className='text-[#4b4b4b] w-[300px] leading-[20px] text-center '>Put your credential to login to congen organization and get connected</p>
      </div>
  
      <div className='flex flex-col justify-center items-center gap-[10px]'>
      <Field type="text" placeholder="Email" value={email} onChange={handleChange1}/>
      <Field type="password" placeholder="Password" value={password} onChange={handleChange2}/>
      <button onClick={()=>{handleLogin()}} className='w-[360px] h-[45px] bg-primary hover:bg-secondary text-primary2  text-xl rounded-sm'>Login</button>
      </div>
      <div className='w-[50%] h-[1.5px] bg-[#ededed]'></div>
      <p className='text-lg'>Don't have an account? <button  onClick={()=>{dispatch(setNavigation(1))}} className='text-primary font-bold mt-[10px]'>SignUp</button> </p>
    </div>
    <div className='relative w-[60%] h-full overflow-hidden'>
      <img src={img1} className='h-screen object-cover' alt="" />
      <div className='absolute inset-0 z-10'></div>
      <div className='absolute inset-0 z-20 bg-gradient-to-t from-transparent to-[#85d0df] rotate-[270deg] -translate-x-[100px] opacity-75'></div>
    </div>
     
    <ToastContainer />
      
   </div>
  )
}

export default Login
