import main from "../assets/logo.png";
import { CiLogin } from "react-icons/ci";
import { logout } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-gray-900 border-b  border-gray-800">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <a href="/" title="" className="inline-flex">
              <img className="w-auto h-28" src={main} alt="Sync-Flex" />
            </a>
          </div>

          {/* Middle section */}
          <div className="hidden lg:flex lg:justify-center lg:space-x-10 xl:space-x-14">
            <a
              href="/home"
              title=""
              className="text-base font-medium text-gray-400 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
            >
              {" "}
              Home{" "}
            </a>

            <a
              href="/youtube"
              title=""
              className="text-base font-medium text-gray-400 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
            >
              {" "}
              Youtube{" "}
            </a>

            <a
              href="#"
              title=""
              className="text-base font-medium text-gray-400 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
            >
              {" "}
              Documentation{" "}
            </a>

            <a
              href="#"
              title=""
              className="text-base font-medium text-gray-400 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
            >
              {" "}
              Help{" "}
            </a>
          </div>

          {/* Signin / Signup / Logout */}
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="font-medium text-gray-400 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <div className="flex items-center justify-end space-x-5">
                  <button
                    type="button"
                    className="p-2 -m-2 text-white transition-all duration-200 lg:hidden hover:text-gray-200"
                  >
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <a
                    href="/signin"
                    title=""
                    className="text-base font-medium text-gray-400 transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
                  >
                    <button
                      type="button"
                      className="relative p-2 -m-2 text-white transition-all duration-200 hover:text-gray-200"
                    >
                      <CiLogin className="w-6 h-6" />
                    </button>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
