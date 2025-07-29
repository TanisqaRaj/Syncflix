import { useState } from "react";
import axios from "axios";
import { auth, provider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Api call for signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(userCred.user, { displayName: username });

      await axios.post("http://localhost:8080/auth/signup/user", {
        email,
        password,
        username,
      });

      alert("User registered successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Google signup
  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await loginWithFirebase(result.user);
    } catch (err) {
      alert("Google Sign-In failed");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl px-8 py-10 relative">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100 blur-xl opacity-60 z-0"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-black">Sign up</h2>
            <p className="text-sm text-gray-600">
              Already joined?{" "}
              <a href="#" className="font-semibold text-black hover:underline">
                Login now
              </a>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            {/* email */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            {/* password */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Password (min. 8 character)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* termsAndCondition */}
            <div className="flex items-center">
              <input id="terms" type="checkbox" className="mr-2" />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree with{" "}
                <span className="font-semibold text-black">
                  Terms & Conditions
                </span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-900"
            >
              Signup
            </button>
          </form>

          <div className="my-6 border-t border-gray-200"></div>

          {/* Signup with google */}
          <button
            className="w-full flex items-center justify-center border py-2 rounded-md bg-white hover:bg-gray-100"
            onClick={handleLoginWithGoogle}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5 mr-2"
            />
            <span className="text-sm font-medium text-black">
              Sign up with Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
