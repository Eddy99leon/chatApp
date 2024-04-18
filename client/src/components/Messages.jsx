import React, { useEffect, useState } from "react";
import { makeRequest } from "../utils/axios";
import CardMessage from "./CardMessage";
import Pusher from "pusher-js";
import { useRef } from "react";
import Entrain from "../components/Entrain";
import { addMessage, updateMessage, deleteMessage } from "../redux/MessageSlice";
import { useDispatch, useSelector } from "react-redux";


const PUSHER_KEY = "cd9b038ddbd2f6499c97";

const Messages = ({ receiveId, setUpdate, newMessage }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);

  const messageEndRef = useRef(null)
  const currentUser = JSON.parse(localStorage.getItem("userData"));


  useEffect(() => {
    messages.map((m) => {
      if(m.statut === "non lu"){
        console.log(m)
        
        makeRequest
        .put(`/api/messages/${m._id}`, {
          sendId: m.sendId,
          sendName: m.sendName,
          receiveId: m.receiveId,
          content: m.content,
          statut: "lu",
          time: m.time,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log("Error update message status:", error);
        });
      }else{
        return m;
      }
    })
  },[receiveId])


  useEffect(() => {
    makeRequest
      .get("/api/messages")
      .then((response) => {
        const filteredMessages = response.data.filter(message => 
          (message.sendId === currentUser?._id && message.receiveId === receiveId)
          || 
          (message.sendId === receiveId && message.receiveId === currentUser?._id)
        );
        dispatch(addMessage(filteredMessages));
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
    //envoyer un message
    channel.bind("inserted", (newMessage) => {
      if (
        (newMessage.sendId === currentUser?._id && newMessage.receiveId === receiveId) ||
        (newMessage.sendId === receiveId && newMessage.receiveId === currentUser?._id)
      ) {
        dispatch(addMessage(newMessage));
      }
    });
    //supprimer un message
    channel.bind("deleted", (deleteMessageId) => {
      dispatch(deleteMessage(deleteMessageId))
    });
    //mise a jour d'un message
    channel.bind("updated", (updatedMessage) => {
      dispatch(updateMessage(updatedMessage))
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [currentUser?._id, receiveId]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom();
  },[messages])


  return (
    <div className="w-full h-full">
      {receiveId ? (
        <div className="relative min-h-full">
          <div>
            {messages?.map((message, index) => {
              return <CardMessage key={index} message={message} setUpdate={setUpdate} />;
            })}
          </div>
          <div ref={messageEndRef}></div>
          <Entrain newMessage={newMessage} receiveId={receiveId} />
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
