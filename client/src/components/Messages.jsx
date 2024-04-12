import React, { useEffect, useState } from "react";
import { makeRequest } from "../utils/axios";
import CardMessage from "./CardMessage";
import Pusher from "pusher-js";


const PUSHER_KEY = "cd9b038ddbd2f6499c97";

const Messages = ({ receiveId, setUpdate }) => {
  const [messages, setMessages] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("userData"));


  useEffect(() => {
    makeRequest
      .get("/api/messages")
      .then((response) => {
        const filteredMessages = response.data.filter(message => 
          (message.sendId === currentUser?._id && message.receiveId === receiveId) 
          || 
          (message.sendId === receiveId && message.receiveId === currentUser?._id)
        );
        setMessages(filteredMessages);
      })
      .catch((error) => {
        console.log("Erreur de recuperation des messages:", error);
      });
  }, [receiveId]);


  //pusher get message
  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe(`${currentUser?._id}`,`${receiveId}`);
    channel.bind("inserted", (newMessage) => {
      if (
        (newMessage.sendId === currentUser?._id && newMessage.receiveId === receiveId) ||
        (newMessage.sendId === receiveId && newMessage.receiveId === currentUser?._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    channel.bind("deleted", (deleteMessageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== deleteMessageId)
      );
    });
    channel.bind("updated", (updateMessage) => {
      setMessages(prevMessages => {
        const messageIndex = prevMessages.findIndex(message => message._id === updateMessage._id);
        if (messageIndex !== -1) {
          const updatedMessages = [...prevMessages];
          updatedMessages[messageIndex] = updateMessage;
          return updatedMessages;
        } else {
          return prevMessages;
        }
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [currentUser?._id, receiveId]);


  return (
    <div className="w-full h-full">
      {receiveId ? (
        <div>
          {messages?.map((message, index) => {
            return <CardMessage key={index} message={message} setUpdate={setUpdate} />;
          })}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-900">
          <p className="font-semibold text-xl text-gray-600">
            Selectionner un utilisateur
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
