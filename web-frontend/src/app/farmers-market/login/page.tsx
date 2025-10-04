'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithOTP, sendOTP } from '../../../../lib/auth-client';

export default function FarmersMarketLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginWithEmail(formData.email, formData.password);

      if (data.success) {
        // Redirect to farmers market
        router.push('/farmers-market');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send OTP
      const otpData = await sendOTP(formData.email, 'login');
      if (otpData.success) {
        // For demo purposes, show the OTP
        alert(`OTP sent! For demo: ${otpData.otp}`);
        
        // Verify OTP
        const verifyData = await loginWithOTP(formData.email, otpData.otp, 'OTP User');
        if (verifyData.success) {
          router.push('/farmers-market');
        } else {
          setError(verifyData.message);
        }
      } else {
        setError(otpData.message);
      }
    } catch (error) {
      setError('OTP login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Farmers' Market</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login Method Tabs */}
          <div className="flex mb-6">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
                loginMethod === 'email'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
                loginMethod === 'otp'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              OTP
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {loginMethod === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOTPLogin} className="space-y-6">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1">
                  <input
                    id="mobile"
                    name="email"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to Farmers' Market?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push('/farmers-market/register')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create an account
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/farmers-market')}
              className="text-sm text-green-600 hover:text-green-500"
            >
              ← Back to Farmers' Market
            </button>
          </div>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Email:</strong> demo@kisaanmela.com</p>
            <p><strong>Password:</strong> demo123</p>
            <p className="text-blue-600">Role: Farmer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
