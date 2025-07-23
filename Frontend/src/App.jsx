import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Home from "./component/Home";
import SignIn from "./component/SignIn";
import NavBar from "./component/Navbar";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:(
        <div>
          <NavBar />
          <Home />
        </div>
      ),
    },
     {
      path: "/signin",
      element: <SignIn />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
