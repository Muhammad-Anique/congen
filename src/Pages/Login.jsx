import React from 'react'
import logo from '../Assets/logo.jpg';
import { Link } from 'react-router-dom';
import img1 from '../Assets/1.jpg'
import Field from '../UI/Field';
function Login() {
  return (
    <div className='w-full h-full bg-[#ffffff] flex flex-row justify-center items-center '>
    <div className='w-[40%] h-full bg-white flex flex-col justify-center items-center gap-[40px]'>
      <div className='flex flex-col justify-center items-center gap-3'>
      <img src={logo} className='h-[120px] w-[120px]' alt="" />
      <p  className='text-[#4b4b4b] w-[300px] leading-[20px] text-center '>Put your credential to login to congen organization and get connected</p>
      </div>
  
      <div className='flex flex-col justify-center items-center gap-[10px]'>
      <Field type="text" placeholder="Email"/>
      <Field type="password" placeholder="Password"/>
      <button className='w-[360px] h-[45px] bg-primary hover:bg-[#66aebd] text-white font-bold text-xl rounded-xl'>Login</button>
      </div>
      <div className='w-[50%] h-[1.5px] bg-[#ededed]'></div>
      <p className='text-lg'>Don't have an account? <Link to="/app/signUp" className='text-primary font-bold mt-[10px]'>SignUp</Link> </p>
    </div>
    <div className='relative w-[60%] h-full overflow-hidden'>
      <img src={img1} className='h-screen object-cover' alt="" />
      <div className='absolute inset-0 z-10'></div>
      <div className='absolute inset-0 z-20 bg-gradient-to-t from-transparent to-[#85d0df] rotate-[270deg] -translate-x-[100px] opacity-75'></div>
    </div>
      
   </div>
  )
}

export default Login
