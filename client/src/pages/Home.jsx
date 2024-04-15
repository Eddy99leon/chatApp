import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pusher from "pusher-js";
import { makeRequest } from "../utils/axios";
import Messages from "../components/Messages";
import { useSelector, useDispatch } from "react-redux";
import { addUser, updateUser, deleteUser } from "../redux/userSlice";
import Entrain from "../components/Entrain";

const PUSHER_KEY = "cd9b038ddbd2f6499c97";

const Home = () => {
  const [newMessage, setNewMessage] = useState();
  const [userConnected, setUserConnected] = useState([]);
  const [receiveId, setReceiveId] = useState();
  const [ update, setUpdate ] = useState()

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("userData"));
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();


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
        setNewMessage("");
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  };

  //update message
  const UpdateMessage = () => {
    makeRequest
      .put(`/api/messages/${update._id}`, {
        sendId: update.sendId,
        sendName: update.sendName,
        receiveId: update.receiveId,
        content: newMessage,
        time: update.time,
      })
      .then((response) => {
        console.log(response.data);
        setNewMessage("");
        setUpdate("")
      })
      .catch((error) => {
        console.log("Error update message:", error);
      });
  };


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


  //pusher get user Connected and Disconnected
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


  // Filtrer les anciens messages en fonction de receiveId
  const filteredUserConnected = userConnected?.filter(
    (user) => user.userId !== currentUser._id
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="py-20">
        <h1 className="font-semibold text-3xl mb-2">
          Bienvenu <span className="capitalize">{currentUser?.name}</span>
        </h1>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <div className="border border-gray-700 h-[400px] w-full mb-3 overflow-y-auto p-4">
              <Messages receiveId={receiveId} setUpdate={setUpdate} />
            </div>
            { update ? 
              <div className="flex items-center gap-3 w-full">
                <textarea
                  defaultValue={update.content}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-gray-800 border border-gray-400 p-2 text-lg w-full outline-none rounded-lg"
                  placeholder="Entrer votre message"
                />
                <button
                  onClick={UpdateMessage}
                  className=" bg-violet-800 p-5 text-xl font-bold text-black rounded-lg"
                >
                  Update
                </button>
              </div> 
              : 
              <div className="flex items-center gap-3 w-full">
                <textarea
                  defaultValue=""
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
            }
            
          </div>
          <div>
            <h1 className="font-bold text-xl mb-3">
              Users connected: {userConnected?.length}
            </h1>
            <div className="space-y-2">
              {filteredUserConnected?.map((user) => {
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
              })}
            </div>
          </div>
        </div>
      </div>
      <Entrain />
    </div>
  );
};

export default Home;
