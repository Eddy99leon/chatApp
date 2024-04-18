import React from 'react'

const UserCard = ({user, receiveId}) => {
  return (
    <div className={`border border-gray-600 p-2 cursor-pointer ${
        receiveId === user.userId ? "bg-gray-700" : ""
      }`}>
        {user.name}
    </div>
  )
}

export default UserCard