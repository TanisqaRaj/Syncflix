import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./component/landing";
import SignIn from "./component/SignIn";
import YouTubeSearch from "./component/YouTubeSearch";
import SignUp from "./component/SignUp";
import NavBar from "./component/Navbar";
import Lobby from "./component/room/Lobby";
import Room from "./component/room/Room";
import ProtectedRoute from "./component/ProtectedRoute";
import Footer from "./component/Footer";
import Home from "./component/Home";

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
      path: "/home",
      element: (
        <div>
          <ProtectedRoute>
            <NavBar />
            <Home />
            <Footer />
          </ProtectedRoute>

        </div>
      ),
    },
    {
      path: "/signin",
      element: (
        <div>
          <NavBar />
          <SignIn />
          <Footer />
        </div>
      ),
    },
    {
      path: "/signup",
      element: <div>
        <NavBar />
        <SignUp />
        <Footer />
      </div>

    },
    {
      path: "/youtube",
      element: <div>
        <NavBar />
        <YouTubeSearch />
        <Footer />
      </div>
    },
    {
      path: "/lobby",
      element: (
        <ProtectedRoute>
          <NavBar />
          <Lobby />
          <Footer />
        </ProtectedRoute>
      ),
    },
    {
      path: "/room/:roomId",
      element: (
        <ProtectedRoute>
          <NavBar />
          <Room />
          <Footer />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
