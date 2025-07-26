import React from 'react'

const SignIn = () => {
  return (
<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative">
        {/* Radiant Glow Background */}
        <div className="absolute -inset-1 rounded-xl radiant-shadow blur-lg opacity-60 z-0"></div>

        {/* Login Card */}
        <div className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100 z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2sm font-semibold">Sign in</h2>
            <p className="text-sm">
              Don’t have an account?{" "}
              <a href="#" className="font-semibold text-black hover:underline">
                Join now
              </a>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                placeholder="Password (min. 8 character)"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm">
                Remember me
              </label>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
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
          <button className="w-full bg-gray-100 text-black py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-200">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
