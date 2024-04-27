import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignupPage } from './pages'
// import { PaymentsPage } from './pages/Payment.tsx'
import { PaymentsPage2 } from './pages/PaymentsPage2.tsx'
import { PaymentsManager } from './pages/PaymentsManager.tsx'

const tmp = 'h-screen bg-black text-white text-4xl text-center grid place-items-center'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div className={tmp}>Oops.. There seems to be a problem.</div>,
    children: [
      // {
      //     path: '/',
      //     element: <Dashboard />,
      // },
      {
        path: '/signup',
        element: <SignupPage />,
      }, {
        path: '/payments2',
        element: <PaymentsPage2 />
      }, {
        path: '/pay',
        element: <PaymentsManager />
      },
      // {
      //   path: '/payments',
      //   element: <PaymentsPage />
      // }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
