import logo from './Assets/logo.jpg';
import './App.css';
import { Link } from 'react-router-dom';
import img1 from './Assets/1.jpg'
import Field from './UI/Field';


function App() {
  return (
   <div className='w-full h-full bg-[#ffffff] flex flex-row justify-center items-center '>
    <div className='w-[40%] h-full bg-white flex flex-col justify-center items-center gap-[40px]'>
      <div className='flex flex-col justify-center items-center relative gap-3'>
      <img src={logo} className='h-[250px] w-[250px]' alt="" />
      <p  className='text-[#4b4b4b] w-[300px] leading-[20px] text-center absolute bottom-[0px]'>Put your credential to login to congen organization and get connected</p>
      </div>
  
      <div className='flex flex-col justify-center items-center gap-[15px]'>
      <Field type="text" placeholder="Email"/>
      <Field type="password" placeholder="Password"/>
      </div>
      <div className='w-[50%] h-[1.5px] bg-[#ededed]'></div>
      <p className='text-lg'>Don't have an account? <span className='text-primary font-bold mt-[10px]'>SignUp</span> </p>
    </div>
    <div className='relative w-[60%] h-full overflow-hidden'>
      <img src={img1} className='h-screen object-cover' alt="" />
      <div className='absolute inset-0 z-10'></div>
      <div className='absolute inset-0 z-20 bg-gradient-to-t from-transparent to-[#85d0df] rotate-[270deg] -translate-x-[100px] opacity-75'></div>
    </div>
      
   </div>
  );
}

export default App;
