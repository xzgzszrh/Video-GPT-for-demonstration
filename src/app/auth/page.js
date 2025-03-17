"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const authToken = document.cookie.includes('auth-token');
    if (authToken) {
      router.push('/tools'); // Redirect to a protected page if already authenticated
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set the auth cookie and redirect
        document.cookie = `auth-token=${password}; max-age=${60*60*24*7}; path=/`; // Expires in 7 days
        router.push('/tools'); // Redirect to the page they were trying to access
      } else {
        setError(data.message || '密码错误');
      }
    } catch (error) {
      setError('验证过程中出现错误');
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">访问受限</h1>
        <p className="mb-6 text-gray-400 text-center">请输入密码以访问此内容</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            验证
          </button>
        </form>
      </div>
    </div>
  );
}
