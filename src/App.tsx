// import React from 'react';
import Navbar from './components/common/Navbar';
import './index.css'
import {
  Outlet,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"


function App() {
  return (
    <div className='transition-colors ease-in-out duration-1000'>
      <Navbar />
      <Toaster />
      <Outlet />
    </div>
  )
}

export default App
