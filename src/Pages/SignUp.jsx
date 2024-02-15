import React, { useEffect, useState } from 'react'
import logo from '../Assets/logo.jpg';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import img1 from '../Assets/1.jpg'
import Field from '../UI/Field';
import ActivitySelector from '../Components/ActivitySelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setNavigation } from '../store/slices/navigationSlice';

import { useTranslation } from 'react-i18next';


function SignUp() {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [page, setpage] =useState(0)
  const [isYoung, setisYoung] = useState(false);
  const [isOld, setisOld] = useState(false);

  const handleAgeChange = (selectedValue) => {
    setisYoung(selectedValue === 'isYoung');
    setisOld(selectedValue === 'isOld');
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    contactNo: '',
    password: '',
    confirmPassword: '',    
  });


  useEffect(()=>{
    console.log("is", formData)
  },[formData])


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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidEmail = () => {
    // Assuming formData is an object with an 'email' property
    const email = formData.email.trim();
  
    // Validate email using a regular expression
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    return emailPattern.test(email);
  };
  

  const isValidDOB = () => {
    // Validate age is 18 or older
    const dob = new Date(formData.dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dob.getFullYear();
    return age >= 18;
  };

  const isValidPassword = () => {
    // Validate password length and match with confirm password
    return formData.password.length >= 8 && formData.password === formData.confirmPassword;
  };

  const isValidContactNo = () => {
    // Validate contact number is from Italy
    // const italyCodePattern = /^\+39/;
    // return italyCodePattern.test(formData.contactNo);
    return true;

  };

  const handleSubmit = (e) => {
     e.preventDefault();

    // Validate before submission
    if (!isValidEmail()) {
      console.error('Invalid email format');
      handleFailure(`${t("Invalid email format")}`)
      return;
    }

    if (!isValidDOB()) {
      console.error('User must be 18 or older');
      handleFailure(`${t("User must be 18 or older")}`)
      return;
    }

    if (!isValidPassword()) {
      console.error('Password must be at least 8 characters and match confirm password');
      handleFailure(`${t("Password does not match")}`)
      return;
    }

    if (!isValidContactNo()) {
      console.error('Invalid contact number for Italy');
      handleFailure(`${t("Invalid Contact Number")}`)
      return;
    }


    if (!isYoung && !isOld) {
      console.error('Invalid contact number for Italy');
      handleFailure(`${t("Select Young or Old")}`)
      return;

    }
    console.log(formData, isYoung, isOld)
    setpage(1)


  }

 
  return (
    <div className='w-full  h-screen bg-[#ffffff] flex flex-row justify-center items-center '>
    <div className='w-[40%] flex flex-col justify-center items-center gap-[20px]'>
      <div className='flex flex-col justify-center items-center relative'>
      <img src={logo} className='h-[80px] w-[80px]' alt="" />
      <p  className='text-[#4b4b4b] w-[300px] leading-[20px] text-center '>Fill in the form to signUp</p>
      {/* <div className='flex flex-row justify-end items-center gap-1 mt-[25px]'>
        <div className='w-[15px] h-[15px] bg-gray-600 rounded-full'> </div>
        <div className='w-[15px] h-[15px] bg-gray-600 rounded-full'> </div>
        <div className='w-[15px] h-[15px] bg-gray-600 rounded-full '> </div>
      </div> */}
      </div>

      {
        page === 0 ? (   <form className='flex flex-col justify-center items-center gap-[12px]' onSubmit={handleSubmit}>
      <Field type="text" placeholder={t("Name")} name="name" value={formData.name} onChange={handleChange} />
      <Field type="text" placeholder={t("Email")} name="email" value={formData.email} onChange={handleChange} />
      <Field type="date" placeholder={t("Date of Birth")} name="dob" value={formData.dob} onChange={handleChange} />
      <Field type="number" placeholder={t("Contact No.")} name="contactNo" value={formData.contactNo} onChange={handleChange} />
      <Field type="password" placeholder={t("Password")} name="password" value={formData.password} onChange={handleChange} />
      <Field type="password" placeholder={t("Confirm Password")} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

          
      <div className='flex flex-row justify-center items-center gap-5'>
        <p>{t("Sign up as")} :</p>
      <label>
        <input
          type="radio"
          name="age"
          value="isYoung"
          checked={isYoung}
          onChange={() => handleAgeChange('isYoung')}
        />
       {t("Young")}
      </label>

      <label>
        <input
          type="radio"
          name="age"
          value="isOld"
          checked={isOld}
          onChange={() => handleAgeChange('isOld')}
        />
        {t("Old")}
      </label>

    </div>
     

     

        <button type="submit" className='w-[360px] h-[45px] bg-primary hover:bg-secondary text-primary2 text-xl rounded-sm'>{t("Next")}</button>
      </form>) : ( <ActivitySelector setFormData={setFormData} isYoung={isYoung} isOld={isOld} Data={formData} page={setpage}/>)
      }
  
     
    <p className='text-lg'>{t("Already have an account?")} <button  onClick={()=>{dispatch(setNavigation(0))}} className='text-primary font-bold mt-[10px]'>login</button> </p>
    {/* <div className='w-[50%] h-[1.5px] bg-[#ededed]'></div> */}
      {/* <p className='text-lg'>Already have an account? <Link className='text-primary font-bold mt-[10px]'>Login</Link> </p> */}
    </div>
    <div className='hidden md:block relative w-[60%] h-full overflow-hidden '>
      <img src={img1} className='h-screen object-cover' alt="" />
      <div className='absolute inset-0 z-10'></div>
      <div className='absolute inset-0 z-20 bg-gradient-to-t from-transparent to-[#85d0df] rotate-[270deg] -translate-x-[100px] opacity-75'></div>
    </div>
      
    <ToastContainer />
   </div>
  )
}

export default SignUp
