'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Clock, MapPin } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const WHATSAPP_NUMBER = '+358413188214'; // Kroi Auto Center WhatsApp number
const BUSINESS_HOURS = {
  monday: { open: '09:00', close: '18:00' },
  tuesday: { open: '09:00', close: '18:00' },
  wednesday: { open: '09:00', close: '18:00' },
  thursday: { open: '09:00', close: '18:00' },
  friday: { open: '09:00', close: '18:00' },
  saturday: { open: '10:00', close: '16:00' },
  sunday: { open: '12:00', close: '16:00' },
};

const QUICK_MESSAGES = [
  'Hei, haluan tietoja autoistanne!',
  'Voisinko varata koeajon?',
  'Mikä on auton lopullinen hinta?',
  'Onko autossa huoltokirja?',
  'Hyväksyttekö vaihtoa?',
  'Voitteko lähettää lisää kuvia?',
];

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [_currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Show widget after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Add welcome message when chat opens
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: `Hei! Tervetuloa Kroi Auto Centeriin! 👋\n\nKuinka voimme auttaa sinua tänään? Voit valita valmiin viestin alta tai kirjoittaa oman kysymyksesi.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const isBusinessHours = () => {
    const now = new Date();
    const time = now.toTimeString().substring(0, 5);

    const dayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];
    const businessDay = BUSINESS_HOURS[dayKey as keyof typeof BUSINESS_HOURS];

    if (!businessDay) return false;

    return time >= businessDay.open && time <= businessDay.close;
  };

  const sendToWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(`${message}\n\n---\nLähetetty Kroi Auto Center verkkosivulta`);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add confirmation message
    setTimeout(() => {
      const confirmMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Viesti lähetetty WhatsAppiin! Odota hetki, vastaamme sinulle pian. 📱',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, confirmMessage]);
    }, 1000);
  };

  const handleQuickMessage = (message: string) => {
    sendToWhatsApp(message);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fi-FI', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Kroi Auto Center</h3>
                  <div className="flex items-center space-x-1 text-green-100 text-xs">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isBusinessHours() ? "bg-green-300" : "bg-gray-400"
                    )} />
                    <span>
                      {isBusinessHours() ? 'Paikalla' : 'Poissa toimistosta'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-lg whitespace-pre-line text-sm",
                    message.isUser
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  )}
                >
                  {message.text}
                  <div className={cn(
                    "text-xs mt-1",
                    message.isUser ? "text-green-100" : "text-gray-500"
                  )}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Messages */}
          <div className="p-4 border-t border-gray-100">
            <div className="text-xs text-gray-600 mb-2">Pikavalinnat:</div>
            <div className="space-y-2">
              {QUICK_MESSAGES.slice(0, 3).map((message, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickMessage(message)}
                  className="w-full text-left text-xs px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>

          {/* Business Info */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>
                  {isBusinessHours()
                    ? 'Avoinna nyt'
                    : 'Ma-Pe 9-18, La 10-16, Su 12-16'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+358 41 318 8214</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Helsinki</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group",
          isOpen && "rotate-180"
        )}
        aria-label="Avaa WhatsApp chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs animate-pulse">
          1
        </div>
      )}

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Keskustele WhatsAppissa
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      )}
    </div>
  );
}