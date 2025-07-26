import React from 'react'
import  { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './component/landing'
import SignIn from './component/SignIn'

function App  ()  {
  const router = createBrowserRouter([
    {
      path: '/',
      element:
       <Landing />,
    },
    {
      path:'/signin',
      element: <SignIn />
    }


  ]);

  // You should return something, for example:
  return <RouterProvider  router={router} />;
}

export default App