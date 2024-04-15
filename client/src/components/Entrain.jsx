import React, { useEffect, useState } from 'react'
import Pusher from "pusher-js";
import { makeRequest } from '../utils/axios';


const PUSHER_KEY = "cd9b038ddbd2f6499c97";

const Entrain = () => {
    const [text, setText] = useState('');

    console.log(text)

    useEffect(() => {
      const pusher = new Pusher(PUSHER_KEY, {
        cluster: "ap2",
      });

      const channel = pusher.subscribe('editor');
      channel.bind('text-update', data => {
        setText(data.text);
      });
  
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }, []);
  
    const handleTextChange = async (e) => {
      const newText = e.target.value;
      setText(newText);
      try {
        await makeRequest.post('/api/messages/text-update', { text: newText });
      } catch (error) {
        console.error('Error updating text:', error);
      }
    };

  return (
    <div>
      <h1 className='mb-2'>Real-Time</h1>
      {text !== "" ? 
        <div className='py-2'>Entrain d'ecrire...</div>
        :
        <div></div>
      }
      <textarea value={text} onChange={handleTextChange} className=' bg-gray-800 text-white p-2 border-none outline-none' />
    </div>
  )
}

export default Entrain