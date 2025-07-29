import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./component/landing";
import SignIn from "./component/SignIn";
import YouTubeSearch from "./component/YouTubeSearch";
import SignUp from "./component/SignUp";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/youtube",
      element: <YouTubeSearch />,
    },
  ]);

  // You should return something, for example:
  return <RouterProvider router={router} />;
}

export default App;
