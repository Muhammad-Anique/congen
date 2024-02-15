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

import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';


import { useTranslation } from 'react-i18next';
// Import your translations
import translationEN from './locale/en.json';
import translationIT from './locale/it.json';

// Configure i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: translationEN
      },
      it: {
        translation: translationIT
      }
    },
    lng: 'it', // set the initial language
    fallbackLng: 'en', // if a translation is missing, fallback to English
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });


function App() {
  console.log(supabase)
  const dispatch = useDispatch();
  const [isCLicked, setIsClicked] =useState(false)
  const [lang, setLang] =useState("it")
  const { t } = useTranslation();
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
      <div className='absolute bottom-2 right-2 z-50 flex flex-col gap-2'>
        {
          isCLicked ? ( <div className=' w-[130px] h-[40px] bg-white text-white rounded-sm shadow-md z-50 flex flex-row p-4 justify-center items-center gap-2'>
          <img onClick={() => {i18n.changeLanguage("en"); setLang("en"); setTimeout(() => {
            setIsClicked(!isCLicked) 
          }, 1500); }} className={`cursor-pointer w-[40px] ${lang==="en" ? ('scale-125 '):('')}`} src="https://flagsapi.com/US/flat/64.png"/>
          <img onClick={() => {i18n.changeLanguage("it"); setLang("it"); setTimeout(() => {
            setIsClicked(!isCLicked) 
          }, 1500);  }} className={`cursor-pointer  w-[40px] ${lang==="it" ? ('scale-125'):('')} `} src="https://flagsapi.com/IT/flat/64.png"/>
           </div>) : ('')
        }
     
      <div onClick={()=>{setIsClicked(!isCLicked)}} className='w-[130px] h-[40px] bg-primary text-primary2 rounded-sm shadow-md  flex p-4 justify-center items-center hover:bg-secondary cursor-pointer'>
      <p className='font-bold'>{t("Translate")}</p>
      </div>
      </div>   
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
      
     
  //     <Page/> 
  //     </Translator> */}