// import React from 'react';
import Navbar from './components/common/Navbar';
import './index.css'
import {
  Outlet,
} from "react-router-dom";


function App() {
  return (
    <div className='dark'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App
