'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Clock, MapPin, Send, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/lib/core/utils';

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
  'Hei! Haluan tietoja valikoimastanne 🚗',
  'Voisinko varata koeajon? 🗓️',
  'Mikä on auton lopullinen hinta? 💰',
  'Onko autossa täydellinen huoltohistoria? 📋',
  'Hyväksyttekö vaihtoautoa osana kauppaa? 🔄',
  'Voitteko lähettää lisää kuvia autosta? 📸',
  'Milloin voin tulla katsomaan autoa? ⏰',
  'Myönnättekö rahoitusta? 🏦',
  'Onko auto ajettu Suomessa? 🇫🇮',
];

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [_currentTime, setCurrentTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickMessages, setShowQuickMessages] = useState(true);

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
    // Add welcome message when chat opens with typing animation
    if (isOpen && messages.length === 0) {
      setIsTyping(true);

      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: '1',
          text: `Hei! Tervetuloa Kroi Auto Centeriin! 👋\n\nOlen täällä auttamassa sinua löytämään unelmiesi auton. Meillä on yli 15 vuoden kokemus laadukkaiden käytettyjen autojen myynnistä Helsingissä.\n\n✨ Valitse alla olevista pikaviesteistä tai kirjoita oma kysymyksesi!`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        setIsTyping(false);
      }, 2000);
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
    setShowQuickMessages(false);

    // Show typing indicator and add confirmation message
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const confirmMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Kiitos viestistäsi! 🙏\n\nViesti on lähetetty WhatsAppiin ja vastaamme sinulle henkilökohtaisesti mahdollisimman pian.\n\n${isBusinessHours() ? '✅ Olemme nyt paikalla ja vastaamme yleensä muutamassa minuutissa!' : '⏰ Toimistoaikamme ovat Ma-Pe 9-18, La 10-16, Su 12-16. Vastaamme seuraavana työpäivänä.'}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, confirmMessage]);
    }, 1500);
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

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start"
    >
      <div className="bg-gray-100 rounded-lg rounded-bl-none px-4 py-3 max-w-[80%]">
        <div className="flex space-x-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">Kroi Auto Center</h3>
                  <div className="flex items-center space-x-2 text-purple-100 text-sm">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isBusinessHours() ? "bg-green-400" : "bg-orange-400"
                      )}
                    />
                    <span className="font-medium">
                      {isBusinessHours() ? '🟢 Paikalla nyt' : '🟠 Vastaamme pian'}
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-purple-100 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50/30 to-white">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className={cn(
                    "flex",
                    message.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] px-4 py-3 rounded-2xl whitespace-pre-line text-sm shadow-md",
                      message.isUser
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                    )}
                  >
                    {message.text}
                    <div className={cn(
                      "text-xs mt-2 opacity-70",
                      message.isUser ? "text-purple-100" : "text-gray-500"
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <TypingIndicator />
              )}
            </AnimatePresence>
          </div>

          {/* Quick Messages */}
          <AnimatePresence>
            {showQuickMessages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-100"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <Send className="h-4 w-4" />
                    <span className="font-medium">Pikavalinnat:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {QUICK_MESSAGES.slice(0, 4).map((message, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickMessage(message)}
                        className="w-full text-left text-sm px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 group-hover:text-gray-900">
                            {message}
                          </span>
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="text-purple-500"
                          >
                            <Send className="h-3 w-3" />
                          </motion.div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Business Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100"
          >
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">
                    {isBusinessHours() ? '✅ Avoinna nyt!' : '⏰ Aukioloajat'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Ma-Pe 9-18, La 10-16, Su 12-16
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Phone className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">+358 41 318 8214</div>
                  <div className="text-xs text-gray-500">WhatsApp & Puhelu</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Helsinki</div>
                  <div className="text-xs text-gray-500">15+ vuotta kokemusta</div>
                </div>
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 180 : 0,
          boxShadow: isOpen
            ? "0 20px 25px -5px rgba(168, 85, 247, 0.4), 0 10px 10px -5px rgba(168, 85, 247, 0.2)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className="relative w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center group overflow-hidden"
        aria-label="Avaa WhatsApp chat"
      >
        <motion.div
          animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <MessageCircle className="h-7 w-7" />
        </motion.div>
        <motion.div
          animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <X className="h-7 w-7" />
        </motion.div>

        {/* Pulse effect */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 bg-purple-400 rounded-full"
        />
      </motion.button>

      {/* Notification Badge */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💬
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap shadow-xl border border-gray-700 group-hover:opacity-100 opacity-0 transition-opacity pointer-events-none"
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">Keskustele WhatsAppissa</span>
            </div>
            <div className="absolute left-full top-1/2 transform -translate-y-1/2">
              <div className="border-8 border-transparent border-l-gray-800"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}