import React from 'react'
import { Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import Registre from './pages/Registre'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
 
const App = () => {
  return (
    <div className='bg-gray-950 w-full min-h-screen text-white'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registre' element={<Registre />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
