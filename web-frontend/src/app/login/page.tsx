'use client';

import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

type Method = 'password' | 'otp';

function LoginPageInner() {
  const [loginMethod, setLoginMethod] = useState<Method>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendSec, setResendSec] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, sendOTP, verifyOTP } = useAuth();

  useEffect(() => {
    if (resendSec <= 0) return;
    const t = setInterval(() => setResendSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendSec]);

  useEffect(() => {
    if (otpStep === 'code') {
      otpRefs.current[0]?.focus();
    }
  }, [otpStep]);

  const redirectAfterLogin = useCallback(() => {
    const r = searchParams.get('redirect');
    router.push(r && r.startsWith('/') ? r : '/dashboard');
  }, [router, searchParams]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(identifier.trim(), password, rememberMe);
      redirectAfterLogin();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
    setLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const digits = mobile.replace(/\D/g, '').slice(-10);
      if (digits.length !== 10) {
        setError('Enter a valid 10-digit mobile number');
        setLoading(false);
        return;
      }
      const r = await sendOTP(digits);
      if (!r.success) {
        setError(r.message || 'Could not send OTP');
        setLoading(false);
        return;
      }
      setOtpStep('code');
      setResendSec(30);
      setOtp(['', '', '', '', '', '']);
      if (r.demo && r.otp) {
        setInfo(`Mock SMS — your OTP is ${r.otp}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    }
    setLoading(false);
  };

  const otpString = otp.join('');

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpString.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const digits = mobile.replace(/\D/g, '').slice(-10);
      await verifyOTP(digits, otpString, undefined, rememberMe);
      redirectAfterLogin();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    }
    setLoading(false);
  };

  const onOtpChange = (i: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const onOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const arr = text.split('').concat(['', '', '', '', '', '']).slice(0, 6);
    setOtp(arr);
    const idx = Math.min(text.length, 5);
    otpRefs.current[idx]?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sign In</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            KisaanMela livestock marketplace — sign in with password or mobile OTP.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome back</h2>

          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('password');
                setError('');
                setOtpStep('phone');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'password' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setError('');
                setOtpStep('phone');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'otp' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Mobile OTP
            </button>
          </div>

          {info && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">{info}</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {loginMethod === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email or username</label>
                <input
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="you@example.com or your_username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  Remember me (longer session)
                </label>
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-md font-medium"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          ) : otpStep === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="10-digit mobile (e.g. 9876543210)"
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-green-600"
                />
                Remember me
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-md font-medium"
              >
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to <span className="font-medium">{mobile}</span>
              </p>
              <div className="flex gap-2 justify-center" onPaste={onOtpPaste}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => onOtpChange(i, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(i, e)}
                    className="w-10 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                ))}
              </div>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="text-green-600 disabled:text-gray-400"
                  disabled={resendSec > 0 || loading}
                  onClick={async () => {
                    if (resendSec > 0) return;
                    setLoading(true);
                    setError('');
                    try {
                      const digits = mobile.replace(/\D/g, '').slice(-10);
                      const r = await sendOTP(digits);
                      if (!r.success) setError(r.message || 'Resend failed');
                      else setResendSec(30);
                    } catch (err: unknown) {
                      setError(err instanceof Error ? err.message : 'Resend failed');
                    }
                    setLoading(false);
                  }}
                >
                  Resend OTP {resendSec > 0 ? `(${resendSec}s)` : ''}
                </button>
                <button
                  type="button"
                  className="text-gray-500"
                  onClick={() => {
                    setOtpStep('phone');
                    setOtp(['', '', '', '', '', '']);
                  }}
                >
                  Change number
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || otpString.length !== 6}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-md font-medium"
              >
                {loading ? 'Verifying…' : 'Verify & sign in'}
              </button>
            </form>
          )}

          <div className="mt-6 space-y-3 text-center text-sm">
            <Link
              href="/marketplace/livestock"
              className="block text-gray-600 hover:text-green-700"
            >
              Continue as guest — browse livestock
            </Link>
            <p className="text-gray-600">
              New here?{' '}
              <Link href="/register" className="text-green-600 font-medium hover:text-green-700">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading…</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
