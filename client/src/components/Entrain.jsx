import React, { useEffect, useState } from 'react'
import Pusher from "pusher-js";
import { makeRequest } from '../utils/axios';


const PUSHER_KEY = "cd9b038ddbd2f6499c97";

const Entrain = ({ newMessage, receiveId }) => {
    const [entrain, setEntrain] = useState();
    const currentUser = JSON.parse(localStorage.getItem("userData"));

    useEffect(() => {
      const pusher = new Pusher(PUSHER_KEY, {
        cluster: "ap2",
      });

      const channel = pusher.subscribe(`${receiveId}`);
      channel.bind('text-update', data => {
        setEntrain(data);
      });
  
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }, []);

    useEffect(() => {
      makeRequest.post('/api/messages/text-update', { text: newMessage, name: currentUser.name, receiveId: currentUser._id });
    },[newMessage])

  return (
    <div className='absolute bottom-0 left-0'>
      {(entrain && entrain?.text !== "")?
        <div className='py-2'>
          <span className='font-bold capitalize mr-1'>
            {entrain?.name} 
          </span>
          est entrain d'ecrire...
        </div>
        :
        <div></div>
      }
    </div>
  )
}

export default Entrain