import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pusher from "pusher-js";
import { makeRequest } from "../utils/axios";
import Messages from "../components/Messages";

const PUSHER_KEY = "cd9b038ddbd2f6499c97";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userConnected, setUserConnected] = useState([]);
  const [receiveId, setReceiveId] = useState();

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("userData"));


  //verifier si connecter
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);


  //envoyer message
  const SendMessage = () => {
    makeRequest
      .post("/api/messages", {
        sendId: currentUser?._id,
        sendName: currentUser?.name,
        receiveId: receiveId,
        content: newMessage,
        time: new Date(),
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
    setNewMessage("");
  };


  //pusher envoyer message
  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);


  //get all userConnected
  useEffect(() => {
    makeRequest
      .get("/api/users/connected")
      .then((response) => {
        setUserConnected(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },[])


  //pusher userConnected
  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("user-channel");
    channel.bind("user-connected", (newUser) => {
      setUserConnected([...userConnected, newUser]);
    });
    channel.bind("user-disconnected", (disconnectedUser) => {
      setUserConnected((prevUsers) =>
        prevUsers.filter((user) => user.userId !== disconnectedUser.userId)
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userConnected]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="py-20">
        <h1 className="font-semibold text-3xl mb-2">
          Bienvenu <span className="capitalize">{currentUser?.name}</span>
        </h1>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <div className="border border-gray-700 h-[400px] w-full mb-3 overflow-y-auto p-4">
              <Messages messages={messages} receiveId={receiveId} />
            </div>
            <div className="flex items-center gap-3 w-full">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-gray-800 p-2 text-lg w-full border-none outline-none rounded-lg"
                placeholder="Entrer votre message"
              />
              <button
                onClick={SendMessage}
                className=" bg-violet-800 p-5 text-xl font-bold text-black rounded-lg"
              >
                Envoyer
              </button>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-xl mb-3">
              Users connected: {userConnected?.length}
            </h1>
            <div className="space-y-2">
              {userConnected?.map((user) => {
                if (user.userId !== currentUser._id) {
                  return (
                    <div
                      key={user.userId}
                      onClick={() => setReceiveId(user.userId)}
                      className={`border border-gray-600 p-2 cursor-pointer ${
                        receiveId === user.userId ? "bg-gray-700" : ""
                      }`}
                    >
                      {user.name}
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
