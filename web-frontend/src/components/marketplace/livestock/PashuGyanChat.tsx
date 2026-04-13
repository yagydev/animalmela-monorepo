'use client';

import { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; text: string };

const QUICK_QUESTIONS = [
  'What\'s a fair price?',
  'Vaccination tips',
  'How to sell faster',
  'Milk yield tips',
];

const WELCOME: Msg = {
  role: 'assistant',
  text: 'Namaste! 🙏 I\'m PashuGyan, your livestock expert. Ask me about pricing, health, breeds, or selling tips!'
};

export function PashuGyanChat({ listingContext }: { listingContext?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text: string) => {
    if (!text.trim() || loading || messages.length >= 21) return;
    const userMsg: Msg = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/livestock/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), context: listingContext })
      });
      const j = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: j.reply || 'Sorry, try again!' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const maxReached = messages.length >= 21;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700 transition"
        aria-label="Open PashuGyan AI"
      >
        🐄 PashuGyan AI
      </button>

      {/* Chat drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-start sm:p-6 pointer-events-none">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30 pointer-events-auto sm:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close"
          />

          <div className="pointer-events-auto relative flex w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:w-[360px] sm:rounded-2xl"
            style={{ height: '420px', maxHeight: '90vh' }}>

            {/* Header */}
            <div className="flex items-center justify-between rounded-t-2xl bg-green-600 px-4 py-3">
              <div>
                <p className="font-bold text-white text-sm">🐄 PashuGyan AI</p>
                <p className="text-xs text-green-100">Livestock expert • Always available</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-white hover:bg-green-800 text-sm">
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Quick questions — only after welcome */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {QUICK_QUESTIONS.map(q => (
                    <button key={q} type="button" onClick={() => send(q)}
                      className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-100 transition">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2 text-gray-500 text-sm">
                    <span className="animate-pulse">•••</span>
                  </div>
                </div>
              )}

              {maxReached && (
                <p className="text-center text-xs text-gray-400 mt-2">
                  Session limit reached. Refresh to start a new chat.
                </p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 px-3 py-3 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder={maxReached ? 'Session limit reached' : 'Ask about livestock…'}
                disabled={loading || maxReached}
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => send(input)}
                disabled={loading || !input.trim() || maxReached}
                className="rounded-xl bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-40 transition"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
