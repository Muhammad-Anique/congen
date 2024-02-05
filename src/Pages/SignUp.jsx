import React from 'react'
import logo from '../Assets/logo.jpg';
import { Link } from 'react-router-dom';
import img1 from '../Assets/1.jpg'
import Field from '../UI/Field';
import ActivitySelector from '../Components/ActivitySelector';


function SignUp() {
  return (
    <div className='w-full h-screen bg-[#ffffff] flex flex-row justify-center items-center '>
    <div className='w-[40%] h-full flex flex-col justify-center items-center gap-[20px]'>
      <div className='flex flex-col justify-center items-center relative'>
      <img src={logo} className='h-[80px] w-[80px]' alt="" />
      <p  className='text-[#4b4b4b] w-[300px] leading-[20px] text-center '>Fill in the form to signUp</p>
      {/* <div className='flex flex-row justify-end items-center gap-1 mt-[25px]'>
        <div className='w-[15px] h-[15px] bg-gray-600 rounded-full'> </div>
        <div className='w-[15px] h-[15px] bg-gray-600 rounded-full'> </div>
        <div className='w-[15px] h-[15px] bg-gray-600 rounded-full '> </div>
      </div> */}
      </div>
  
      {/* <div className='flex flex-col justify-center items-center gap-[12px]'>
      <Field type="text" placeholder="Name"/>
      <Field type="text" placeholder="Email"/>
      <Field type="text" placeholder="Date of Birth"/>
      <Field type="text" placeholder="Contact No."/>
      <Field type="password" placeholder="Password"/>
      <Field type="password" placeholder="Confirm Password"/>
      <button className='w-[360px] h-[45px] bg-primary hover:bg-[#66aebd] text-white font-bold text-xl rounded-xl'>Next</button>
      </div> */}

    <ActivitySelector/>

  
    <div className='w-[50%] h-[1.5px] bg-[#ededed]'></div>
      <p className='text-lg'>Already have an account? <Link className='text-primary font-bold mt-[10px]'>Login</Link> </p>
    </div>
    <div className='hidden md:block relative w-[60%] h-full overflow-hidden '>
      <img src={img1} className='h-screen object-cover' alt="" />
      <div className='absolute inset-0 z-10'></div>
      <div className='absolute inset-0 z-20 bg-gradient-to-t from-transparent to-[#85d0df] rotate-[270deg] -translate-x-[100px] opacity-75'></div>
    </div>
      
   </div>
  )
}

export default SignUp
