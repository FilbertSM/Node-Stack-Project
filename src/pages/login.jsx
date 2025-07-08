import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State to handle loading status during API calls
  const [loading, setLoading] = useState(false);
  // State to hold any login errors from the backend
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts
    setError(null);   // Clear any previous errors

    try {
      // Make the API call to your backend's login endpoint
      // IMPORTANT: Ensure this URL points to your backend server (e.g., port 3000)
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // Parse the JSON response

      if (!res.ok) {
        // If response is not OK (e.g., 401, 400, 500), throw an error with the message from backend
        throw new Error(data.message || 'Failed to login. Please check your credentials.');
      }

      // If login is successful, navigate to the boardPages
      console.log('Login successful:', data);
      navigate('/home'); // Navigate to your desired page after login

    } catch (err) {
      // Catch network errors or errors thrown from the response handling
      console.error('Error during login:', err);
      setError(err.message || 'Network error. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8">Sign in to your account</h1>

          {/* Display error message if login fails */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="em  ail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full bg-gray-800 border-b-2 border-gray-600 text-white p-3 focus:outline-none focus:ring-0 focus:border-white transition"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading} // Disable input while loading
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
                  autoComplete="current-password"
                  required
                  className="w-full bg-gray-800 border-b-2 border-gray-600 text-white p-3 focus:outline-none focus:ring-0 focus:border-white transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading} // Disable input while loading
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-colors disabled:opacity-50"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Signing In...' : 'SIGN IN'}
              </button>
            </div>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* Google Login Button - Assuming Google OAuth routes are enabled in backend */}
          <div>
            <a
              href="http://localhost:3000/api/users/login/google" // Link to your backend's Google OAuth initiation route
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-600 rounded-full shadow-sm text-md font-medium text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-colors"
            >
              <img src="https://www.svgrepo.com/show/353787/google-icon.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </a>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-900 order-first md:order-last">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">New here?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Sign up and discover a great amount of new opportunities!
          </p>

          <Link
            to="/register"
            className="py-3 px-12 border border-white rounded-full text-lg font-bold text-white bg-transparent hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-colors"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
