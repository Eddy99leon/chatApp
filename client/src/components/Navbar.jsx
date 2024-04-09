import React from 'react'

const Navbar = () => {

  const handelLogout = () => {
    
  }

  return (
    <div className='py-4 flex items-center justify-between px-10'>
      <div className='font-bold text-xl'>
        ChatBe
      </div>
      <div>
        <button onClick={handelLogout} className='py-2 px-3 font-semibold text-lg bg-violet-700'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar