import React from 'react'

const CardMessage = ({message}) => {
    const userData = localStorage.getItem("userData");
    const user = JSON.parse(userData);

    const ownMessage = message?.sendId === user?._id

    return (
      <div className={`max-w-[200px] ${ownMessage ? "ml-auto" : ""}`}>
        <div
          className={`p-2 bg-gray-700 rounded-md ${
            ownMessage ? "bg-blue-500 text-white" : ""
          }`}
        >
          {message?.content}
        </div>
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <h2 className="capitalize">{message?.sendName}</h2>
          <p>{message?.time.toString().slice(11, 16)}</p>
        </div>
      </div>
    );
}

export default CardMessage