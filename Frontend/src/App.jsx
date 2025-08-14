import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./component/landing";
import SignIn from "./component/SignIn";
import YouTubeSearch from "./component/YouTubeSearch";
import SignUp from "./component/SignUp";
import NavBar from "./component/Navbar";
import Lobby from "./component/room/Lobby";
import Room from "./component/room/Room";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <NavBar />
          <Landing />
        </div>
      ),
    },
    {
      path: "/signin",
      element: (
        <div>
          <NavBar />
          <SignIn />
        </div>
      ),
    },
    {
      path: "/signup",
      element: <SignUp />
    },
    {
      path: "/youtube",
      element: <YouTubeSearch />
    },
    {
      path: "/lobby",
      element: <Lobby />
    },
    {
      path: "/room",
      element: <Room />
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
