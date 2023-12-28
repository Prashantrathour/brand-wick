import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // Import the desired icon
import { Link } from 'react-router-dom'; // If you're using React Router
import {useNavigate} from "react-router-dom"
import {ToastContainer,toast} from "react-toastify"
import { succesAlert } from '../Notification';
function Home() {
    const navigate=useNavigate()
    function onLogout(){
        localStorage.removeItem("token")
        succesAlert("user logged out")
        setTimeout(() => {
            navigate("/login")
        }, 2000);
    }

    useEffect(()=>{
     if(!localStorage.getItem("token")){
      navigate("/login")
     }
    },[])
  return (
    <div className='w-full'>
        <nav className='flex justify-end p-4 w-full bg-gray-500'><button onClick={onLogout} className='bg-black text-white font-semibold text-xl p-2 px-3 rounded-full '>Logout</button></nav>
    <ToastContainer/>
    <div className="text-center mt-8 flex flex-col justify-center items-center">
      <FaCheckCircle className="text-green-500 text-5xl mb-4" />
      <h2 className="text-2xl font-bold mb-4">You have successfully logged in to your account!</h2>
      <p className="text-gray-600">Welcome to your dashboard.</p>
      
      
    

     
    </div>
    </div>
  );
}

export default Home;
