'use client';

import { marketplaceApiFetch } from '@/lib/kisaanmela-marketplace/api-client';
import { setStoredMarketplaceToken } from '@/lib/kisaanmela-marketplace/auth-storage';
import { marketplaceKisaanRoutes } from '@/lib/kisaanmela-marketplace/routes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function KisaanMarketplaceLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  async function sendOtp() {
    setError(null);
    setLoading(true);
    try {
      const res = await marketplaceApiFetch<{ ok: boolean; devHint?: string }>('/auth/otp/send', {
        method: 'POST',
        json: { phone: phone.replace(/\s/g, '') },
      });
      if (res.devHint) setHint('Dev mode: use OTP_DEV_CODE from the API server (often 123456).');
      setStep('otp');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError(null);
    setLoading(true);
    try {
      const res = await marketplaceApiFetch<{ accessToken: string }>('/auth/otp/verify', {
        method: 'POST',
        json: { phone: phone.replace(/\s/g, ''), code: code.replace(/\s/g, '') },
      });
      setStoredMarketplaceToken(res.accessToken);
      router.push(marketplaceKisaanRoutes.products);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketplace sign in</h1>
        <p className="mt-1 text-gray-600">We send a code to your mobile number.</p>
      </div>

      {step === 'phone' ? (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Mobile number</span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="e.g. +919876543210"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none ring-green-600 focus:ring-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={loading || phone.length < 8}
            onClick={sendOtp}
            className="w-full rounded-xl bg-green-700 py-3.5 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Please wait…' : 'Get OTP'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Enter OTP</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-2xl tracking-[0.3em] outline-none ring-green-600 focus:ring-2"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          {hint && <p className="text-sm text-amber-800">{hint}</p>}
          <button
            type="button"
            disabled={loading || code.length < 4}
            onClick={verify}
            className="w-full rounded-xl bg-green-700 py-3.5 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Sign in'}
          </button>
          <button
            type="button"
            className="w-full text-sm font-medium text-green-800"
            onClick={() => {
              setStep('phone');
              setCode('');
            }}
          >
            Change number
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
