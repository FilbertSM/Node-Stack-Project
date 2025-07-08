import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-900 order-last md:order-first">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Already have an account?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Sign in and continue your productivity.
          </p>
          <button
            type="button"
            className="py-3 px-12 border border-white rounded-full text-lg font-bold text-white bg-transparent hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-colors"
          >
            SIGN IN
          </button>
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8">Create your account</h1>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full bg-gray-800 border-b-2 border-gray-600 text-white p-3 focus:outline-none focus:ring-0 focus:border-white transition"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full bg-gray-800 border-b-2 border-gray-600 text-white p-3 focus:outline-none focus:ring-0 focus:border-white transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-gray-800 border-b-2 border-gray-600 text-white p-3 focus:outline-none focus:ring-0 focus:border-white transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-colors"
              >
                SIGN UP
              </button>
            </div>
          </form>

          {/* Separator */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* Google Login Button */}
          <div>
            <button
              type="button"
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-600 rounded-full shadow-sm text-md font-medium text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-colors"
            >
              <FcGoogle size={24} />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
