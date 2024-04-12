import React, { useState } from 'react'
import { makeRequest } from '../utils/axios';

const CardMessage = ({ message, setUpdate }) => {
    const currentUser = JSON.parse(localStorage.getItem("userData"));
    const ownMessage = message?.sendId === currentUser?._id
    const [ open, setOpen ] = useState(false)
    const [ notif, setNotif ] = useState()

    const handleOpen = () => {
      setOpen(!open)
    }

    const handleSupp = async () => {
      await makeRequest.delete(`/api/messages/${message?._id}`)
      .then((response) => {
        setNotif(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    return (
      <div className='relative'>
        <div onClick={handleOpen} className={`max-w-[200px] mr-1 ${ownMessage ? "ml-auto" : ""}`}>
          <p
            className={`p-2  rounded-md ${ownMessage ? "bg-blue-500" : "bg-gray-700"}`}
          >
            {message?.content}
          </p>
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <h2 className="capitalize">{message?.sendName}</h2>
            <p>{message?.time.toString().slice(11, 16)}</p>
          </div>
        </div>
        <div className={`absolute bg-gray-200 text-gray-500 rounded-lg px-4 py-2 top-12 z-10 ${ownMessage ? "right-0" : "left-0"} ${open ? "block" : "hidden"}`}>
          <ul className='space-y-1 text-sm font-medium'>
            <li onClick={handleSupp} className='hover:text-gray-800 cursor-pointer'>Supprimer</li>
            <li onClick={() => setUpdate(message)} className='hover:text-gray-800 cursor-pointer'>Editer</li>
          </ul>
        </div>
      </div>
    );
}

export default CardMessage