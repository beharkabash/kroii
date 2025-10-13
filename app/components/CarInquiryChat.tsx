'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, MapPin, Car } from 'lucide-react';

interface CarInquiryChatProps {
  car?: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    price: string;
    slug: string;
  };
  className?: string;
}

const WHATSAPP_NUMBER = '+358413188214';

export default function CarInquiryChat({ car, className }: CarInquiryChatProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<string>('');

  const carSpecificQuestions = car ? [
    `Hei! Olen kiinnostunut autosta: ${car.name}. Voisinko saada lisätietoja?`,
    `Onko ${car.name} vielä myynnissä? Voisinko varata koeajon?`,
    `Mikä on ${car.name} lopullinen hinta? Sisältyykö siihen kaikki kulut?`,
    `Onko ${car.name} huoltokirja ja onko auto ollut kolareissa?`,
    `Hyväksyttekö vaihtoa ${car.name} kohdalla? Minulla on vaihdossa...`,
    `Voisitteko lähettää lisää kuvia autosta ${car.name}?`,
  ] : [
    'Hei! Etsin käytettyä autoa. Voisitteko auttaa?',
    'Millaisia autoja teillä on tällä hetkellä myynnissä?',
    'Voisinko varata ajan autojen katseluun?',
    'Tarjoatteko rahoitusta autojen ostoon?',
    'Hyväksyttekö vaihtoa? Minulla on vaihdossa...',
    'Missä teidän myymälänne sijaitsee?',
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      subtitle: 'Nopea vastaus',
      action: () => sendWhatsAppMessage(selectedInquiry || carSpecificQuestions[0]),
      primary: true,
    },
    {
      icon: Phone,
      title: 'Soita',
      subtitle: '+358 41 318 8214',
      action: () => window.open('tel:+358413188214'),
    },
    {
      icon: Mail,
      title: 'Sähköposti',
      subtitle: 'info@kroiautocenter.fi',
      action: () => window.open('mailto:info@kroiautocenter.fi' + (car ? `?subject=Kysely autosta: ${car.name}` : '')),
    },
  ];

  const sendWhatsAppMessage = (message: string) => {
    let fullMessage = message;

    if (car) {
      fullMessage += `\n\n📋 Auton tiedot:\n🚗 ${car.name}\n💰 ${car.price}\n🔗 ${window.location.origin}/cars/${car.slug}`;
    }

    fullMessage += '\n\n---\n📱 Lähetetty Kroi Auto Center verkkosivulta';

    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={className}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              {car ? <Car className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {car ? `Kysy autosta` : 'Ota yhteyttä'}
              </h3>
              <p className="text-purple-100">
                {car ? car.name : 'Kroi Auto Center'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Questions */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Valitse kysymys tai kirjoita oma:
            </h4>
            <div className="space-y-2">
              {carSpecificQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedInquiry(question)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedInquiry === question
                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-900 mb-2">
              Tai kirjoita oma viestisi:
            </label>
            <textarea
              value={selectedInquiry}
              onChange={(e) => setSelectedInquiry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder={car
                ? `Hei! Olen kiinnostunut autosta ${car.name}. Voisinko saada lisätietoja?`
                : 'Kirjoita kysymyksesi tähän...'
              }
            />
          </div>

          {/* Contact Methods */}
          <div className="space-y-3">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={index}
                  onClick={method.action}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all group ${
                    method.primary
                      ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${method.primary ? 'text-white' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className={`font-semibold ${method.primary ? 'text-white' : 'text-gray-900'}`}>
                        {method.title}
                      </div>
                      <div className={`text-sm ${method.primary ? 'text-green-100' : 'text-gray-500'}`}>
                        {method.subtitle}
                      </div>
                    </div>
                  </div>
                  {method.primary && (
                    <div className="text-white text-sm font-medium">
                      Lähetä →
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Business Hours */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <Clock className="h-4 w-4" />
              <div>
                <div className="font-medium">Aukioloajat:</div>
                <div>Ma-Pe 9:00-18:00, La 10:00-16:00, Su 12:00-16:00</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 text-sm mt-2">
              <MapPin className="h-4 w-4" />
              <span>Helsinki</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}