'use client';
import { LoginUser } from "../../lib/login/login";
import { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSyncAlt, FaArrowLeft } from 'react-icons/fa'; 
import { useRouter } from 'next/navigation'; 
import toast from 'react-hot-toast'
import { jwtDecode } from "jwt-decode";
import Link from 'next/link';
import Cookies from "js-cookie";

function generateCaptcha() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check captcha input
    if (captchaInput !== captcha) {
      toast.error('Captcha does not match. Please try again.');
      return;
    }

    try {
      // Submit login request
      const response = await LoginUser(formData); 
      if (!response) throw new Error("Invalid credentials");

      // Save token and cart items to localStorage
      localStorage.setItem("token", response);
      const tokenWithBearer = localStorage.getItem("token");
      const token = tokenWithBearer.slice(7);
     
        
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      
      // if (!localStorage.getItem("cartItem")) {
      //   localStorage.setItem("cartItem", JSON.stringify([])); 
      // }
      // Decode token for user info (e.g., isAdmin flag)
      const decoded = jwtDecode(response);

      toast.success(`Login successful! Welcome ${decoded.isAdmin ? "Admin" : "User"} to the Dashboard`);

      // Redirect based on user role
      setTimeout(() => {
        if (decoded.isAdmin) {
          router.push('/admin');
        } else  {
          router.push('/user/home');
        }
      }, 2000);
    } catch (error) {
      toast.error(error.specificMessage || error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-cover bg-center relative pt-20" 
      style={{ backgroundImage: `url('https://static.startuptalky.com/2024/01/Virat-Kohli-Brand-Ambassador-List-of-the-companies-Startuptalky.jpg')` }}>
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-12 text-white relative z-20">
        <h1 className="text-5xl font-bold mb-6">Welcome to AreSports</h1>
        <p className="text-lg mb-8">The best place for sports gear.</p>
        <p className="font-semibold">Join us today and experience the future of shopping.</p>
      </div>
      
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8 z-20">
        <div className="w-full max-w-md p-8 bg-white/90 rounded-xl shadow-lg" style={{ backdropFilter: 'blur(10px)' }}>
          <button 
            onClick={() => router.back()} 
            className="absolute top-4 left-4 text-white text-lg flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <h2 className="text-3xl font-bold text-center text-red-600">Log In</h2>
          <p className="mt-2 text-center text-gray-600">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4 relative">
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="mb-4 relative">
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                  placeholder="Enter your password"
                  required
                />
                <div
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Captcha</label>
              <div className="flex items-center">
                <div className="bg-gray-200 text-gray-700 font-mono px-4 py-2 rounded-md">{captcha}</div>
                <FaSyncAlt
                  className="ml-4 text-yellow-500 cursor-pointer"
                  onClick={() => setCaptcha(generateCaptcha())}
                  title="Refresh Captcha"
                />
              </div>
              <input
                type="text"
                placeholder="Enter captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Log In
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <Link href="/register" className="text-red-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
