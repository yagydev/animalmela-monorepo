'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import WhatsAppButton from './WhatsAppButton';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses = {
    en: {
      greeting: "Hello! I'm Kisaanmela Assistant. How can I help you today?",
      schemes: "Here are some popular government schemes:\n• PM-Kisan: ₹6000/year direct benefit\n• AgriStack: Digital agriculture platform\n• Soil Health Card: Free soil testing\n• Crop Insurance: Weather-based protection",
      credit: "For credit card eligibility:\n• Minimum income: ₹2.5 lakh/year\n• Credit score: 750+\n• Age: 21-65 years\n• Documents: PAN, Aadhaar, Income proof",
      mela: "Kisaanmela events:\n• Monthly farmer markets\n• Agricultural workshops\n• Equipment demonstrations\n• Government scheme awareness camps",
      fallback: "I understand you're asking about farming. For detailed assistance, please contact our support team via WhatsApp."
    },
    hi: {
      greeting: "नमस्ते! मैं किसानमेला असिस्टेंट हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      schemes: "लोकप्रिय सरकारी योजनाएं:\n• पीएम-किसान: ₹6000/वर्ष प्रत्यक्ष लाभ\n• एग्रीस्टैक: डिजिटल कृषि प्लेटफॉर्म\n• मृदा स्वास्थ्य कार्ड: मुफ्त मिट्टी परीक्षण\n• फसल बीमा: मौसम आधारित सुरक्षा",
      credit: "क्रेडिट कार्ड पात्रता:\n• न्यूनतम आय: ₹2.5 लाख/वर्ष\n• क्रेडिट स्कोर: 750+\n• आयु: 21-65 वर्ष\n• दस्तावेज: PAN, आधार, आय प्रमाण",
      mela: "किसानमेला कार्यक्रम:\n• मासिक किसान बाजार\n• कृषि कार्यशालाएं\n• उपकरण प्रदर्शन\n• सरकारी योजना जागरूकता शिविर",
      fallback: "मैं समझता हूं कि आप कृषि के बारे में पूछ रहे हैं। विस्तृत सहायता के लिए कृपया हमारी सहायता टीम से WhatsApp के माध्यम से संपर्क करें।"
    }
  };

  const responses = predefinedResponses[i18n.language as keyof typeof predefinedResponses] || predefinedResponses.en;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage(responses.greeting, 'bot');
    }
  }, [isOpen, i18n.language]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('scheme') || message.includes('योजना') || message.includes('benefit') || message.includes('लाभ')) {
      return responses.schemes;
    }
    
    if (message.includes('credit') || message.includes('card') || message.includes('क्रेडिट') || message.includes('कार्ड')) {
      return responses.credit;
    }
    
    if (message.includes('mela') || message.includes('event') || message.includes('मेला') || message.includes('कार्यक्रम')) {
      return responses.mela;
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('नमस्ते') || message.includes('नमस्कार')) {
      return responses.greeting;
    }
    
    return responses.fallback;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    addMessage(inputMessage, 'user');
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(inputMessage);
      addMessage(response, 'bot');
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Kisaanmela Assistant</h3>
              <p className="text-xs opacity-90">Online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* WhatsApp Fallback */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500 mb-2">Need more help?</p>
              <WhatsAppButton
                phone="919876543210"
                message="Hello, I need assistance with Kisaanmela services"
                className="text-xs px-2 py-1"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
