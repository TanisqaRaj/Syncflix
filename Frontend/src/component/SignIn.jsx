import { useState } from "react";
import axios from "axios";
import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginWithFirebase = async (user) => {
    const idToken = await user.getIdToken();
    const res = await axios.post("http://localhost:8080/auth/login", {
      idToken,
    });
    dispatch(
      login({
        email: user.email,
        uid: user.uid,
        token: idToken,
      })
    );
    alert(res.data.message);
    navigate("/lobby");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await loginWithFirebase(userCred.user);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await loginWithFirebase(result.user);
    } catch (err) {
      alert("Google Sign-In failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-md">
        {/* Radiant Glow Background */}
        <div className="absolute -inset-1 rounded-xl radiant-shadow blur-lg opacity-60 z-0"></div>

        {/* Login Card */}
        <div className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100 z-10">
          {/* Header */}
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-2xl text-black font-semibold">Sign in</h2>
          </div>

          {/*Signup text */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-black hover:underline"
              >
                SignUp
              </a>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <a href="#" className="text-sm text-gray-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 8 character)"
                className="w-full px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
              onClick={handleLogin}
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-2 text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Sign-in */}
          <button
            className="w-full bg-gray-100 text-black py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-200"
            onClick={handleLoginWithGoogle}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
          <div>
            <p className="text-sm">
              Don’t have an account?{" "}
              <a href="#" className="font-semibold text-black hover:underline">
                Join now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
