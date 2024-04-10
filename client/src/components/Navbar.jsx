import React, { useState } from 'react'
import { makeRequest } from "../utils/axios"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [ notif, setNotif ] = useState()
  const navigate = useNavigate();
  
  const handelLogout = () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    makeRequest.post(`/api/auths/logout/${user?._id}`)
    .then((response) => {
      setNotif(response.data);
      localStorage.removeItem("userData");
      navigate("/login");
    })
    .catch((error) => {
      console.log("Erreur lors de la déconnexion!", error);
    })
  }
  // console.log(notif);

  return (
    <div className='py-4 flex items-center justify-between px-10'>
      <div className='font-bold text-xl'>
        ChatBe
      </div>
      <div>
        <button onClick={handelLogout} className='py-2 px-3 font-medium text-lg bg-violet-700 rounded-lg text-black'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar