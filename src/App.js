import logo from './Assets/logo.jpg';
import './App.css';
import { Link } from 'react-router-dom';
import img1 from './Assets/1.jpg'
import Field from './UI/Field';
import { useDispatch, useSelector } from 'react-redux';
import YoungDashboard from './Pages/YoungDashboard';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import { setNavigation } from './store/slices/navigationSlice';
import supabase from './config/supabaseClient';
import OldDashboard from './Pages/OldDashboard';
import { useEffect, useState } from 'react';

import {
  Translator,
  T,
  Config
} from "react-translator-component";


Config.default = "en";

Config.list = {
  en: {
    text: "English",
    file: require("./locale/en.locale")
  },
  it: {
    text: "Italiano",
    file: require("./locale/it.locale")
  }
};

function App() {
  console.log(supabase)
  const [language, setLanguage] = useState(Config.default);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // This function will be called when the window is about to unload
      // You can update the slices value here before the window closes
      // For example, set slices to a different value
      dispatch(setNavigation(0))
      // Optionally, you can provide a message to the user
      event.returnValue = ''; // This is required for some browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup function to remove the event listener when the component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  function Page(){
      const data = useSelector((state)=>{ return state.navigation.data })
      console.log("data " ,data);
       if(data==0){
        return(
        <Login/>         
        )
      }else if(data==1){
        return(
          <SignUp/>
        )
      }
      else if(data==2){
        return(
        <YoungDashboard/>               
        )
      }
      else if(data==3){
        return(
          <OldDashboard/>
        )
      }

  }


  return (
      <>
    
      <Page/>
  </>
  );


  // return (
  //  <div className='w-full h-full bg-[#ffffff] flex flex-row justify-center items-center '>
  //   <div className='w-[40%] h-full bg-white flex flex-col justify-center items-center gap-[40px]'>
  //     <div className='flex flex-col justify-center items-center relative gap-3'>
  //     <img src={logo} className='h-[250px] w-[250px]' alt="" />
  //     <p  className='text-[#4b4b4b] w-[300px] leading-[20px] text-center absolute bottom-[0px]'>Put your credential to login to congen organization and get connected</p>
  //     </div>
  
  //     <div className='flex flex-col justify-center items-center gap-[15px]'>
  //     <Field type="text" placeholder="Email"/>
  //     <Field type="password" placeholder="Password"/>
  //     </div>
  //     <div className='w-[50%] h-[1.5px] bg-[#ededed]'></div>
  //     <p className='text-lg'>Don't have an account? <span className='text-primary font-bold mt-[10px]'>SignUp</span> </p>
  //   </div>
  //   <div className='relative w-[60%] h-full overflow-hidden'>
  //     <img src={img1} className='h-screen object-cover' alt="" />
  //     <div className='absolute inset-0 z-10'></div>
  //     <div className='absolute inset-0 z-20 bg-gradient-to-t from-transparent to-[#85d0df] rotate-[270deg] -translate-x-[100px] opacity-75'></div>
  //   </div>
      
  //  </div>
  // );
}

export default App;



  // {/* <Translator>
  //     <div className='absolute bottom-2 right-2 z-50 flex flex-col gap-2'>
  //     <div className=' w-[100px] h-[30px] bg-white text-white rounded-sm shadow-md z-50 flex flex-row p-4 justify-center items-center gap-2'>
  //     <img onClick={() => setLanguage("en")} className='hover:scale-110 cursor-pointer' src="https://flagsapi.com/US/flat/32.png"/>
  //     <img onClick={() => setLanguage("it")} className='hover:scale-110 cursor-pointer' src="https://flagsapi.com/IT/flat/32.png"/>
  //      </div>
  //     <div className='w-[100px] h-[30px] bg-primary text-white rounded-sm shadow-md  flex p-4 justify-center items-center hover:bg-secondary cursor-pointer'>
  //       {/* <p className='font-bold '>{("Translate")}</p> */}
  //       <h1>{T("Hello, World!")}</h1>
  //     </div>
  //     </div>
     
  //     <Page/> 
  //     </Translator> */}