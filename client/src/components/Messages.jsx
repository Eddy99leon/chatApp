import React, { useEffect, useState } from "react";
import { makeRequest } from "../utils/axios";
import CardMessage from "./CardMessage";

const Messages = ({ messages, receiveId }) => {
  const [oldMessages, setOldMessages] = useState();

  useEffect(() => {
    makeRequest
      .get("/api/messages")
      .then((response) => {
        setOldMessages(response.data);
      })
      .catch((error) => {
        console.log("Erreur de recuperation des messages:", error);
      });
  }, []);

  // Filtrer les anciens messages en fonction de receiveId
  const filteredOldMessages = oldMessages?.filter(
    (message) => message.receiveId === receiveId
  );

  // Filtrer les messages en cours en fonction de receiveId
  const filteredMessages = messages?.filter(
    (message) => message.receiveId === receiveId
  );

  return (
    <div className="w-full h-full">
      {receiveId ? (
        <div>
          {filteredOldMessages?.map((message, index) => {
            return <CardMessage key={index} message={message} />;
          })}
          {filteredMessages?.map((message, index) => {
            return <CardMessage key={index} message={message} />;
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
