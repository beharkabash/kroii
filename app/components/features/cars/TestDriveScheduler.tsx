'use client';

import { useState } from 'react';
import { Calendar, Clock, Car, User, ChevronRight } from 'lucide-react';

interface TestDriveSchedulerProps {
  vehicleId?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    image?: string;
  };
  className?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '12:00', available: true },
  { time: '13:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: true },
];

export default function TestDriveScheduler({ vehicleId, vehicleInfo, className = '' }: TestDriveSchedulerProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
    location: 'DEALERSHIP',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/services/test-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          vehicleId,
          type: 'TEST_DRIVE',
          duration: 30,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Jokin meni pieleen. Yritä uudelleen.');
      }
    } catch (error) {
      console.error('Error submitting test drive:', error);
      alert('Jokin meni pieleen. Yritä uudelleen.');
    }

    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
        <div className="text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Koeajo varattu!
          </h3>
          <p className="text-slate-600 mb-6">
            Olemme lähettäneet vahvistuksen sähköpostitse. Otamme sinuun yhteyttä 24 tunnin sisällä.
          </p>
          {vehicleInfo && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600">Varattu ajoneuvo:</p>
              <p className="font-semibold text-slate-900">
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
              setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                scheduledDate: '',
                scheduledTime: '',
                notes: '',
                location: 'DEALERSHIP',
              });
            }}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Varaa toinen koeajo
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className={`bg-white rounded-2xl shadow-xl ${className}`}>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Varaa koeajo
          </h2>
          <p className="text-slate-600">
            Varaa maksuton koeajo ja koe auto itse
          </p>

          {vehicleInfo && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                  }
                `}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <ChevronRight className={`h-4 w-4 ml-2 ${step > stepNumber ? 'text-blue-600' : 'text-slate-400'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Yhteystiedot
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-2">
                    Nimi *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Etunimi Sukunimi"
                  />
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-slate-700 mb-2">
                    Puhelinnumero *
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+358 40 123 4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-slate-700 mb-2">
                  Sähköposti *
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="nimi@example.com"
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.customerName || !formData.customerEmail || !formData.customerPhone}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                Jatka
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          )}

          {/* Step 2: Date and Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Päivämäärä ja aika
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-slate-700 mb-2">
                    Päivämäärä *
                  </label>
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    min={today}
                    max={maxDateStr}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                    Sijainti
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DEALERSHIP">Liikkeessämme</option>
                    <option value="CUSTOMER_LOCATION">Luoksesi (lisämaksu)</option>
                  </select>
                </div>
              </div>

              {formData.scheduledDate && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Valitse aika *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, scheduledTime: slot.time }))}
                        disabled={!slot.available}
                        className={`
                          p-3 rounded-lg border text-sm font-medium transition
                          ${formData.scheduledTime === slot.time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : slot.available
                              ? 'bg-white text-slate-700 border-slate-300 hover:border-blue-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          }
                        `}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Takaisin
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!formData.scheduledDate || !formData.scheduledTime}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  Jatka
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information and Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Vahvistus
              </h3>

              <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-slate-900">Koeajon tiedot:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Nimi:</span>
                    <span className="ml-2 font-medium">{formData.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Sähköposti:</span>
                    <span className="ml-2 font-medium">{formData.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Puhelin:</span>
                    <span className="ml-2 font-medium">{formData.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Päivämäärä:</span>
                    <span className="ml-2 font-medium">
                      {new Date(formData.scheduledDate).toLocaleDateString('fi-FI')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Aika:</span>
                    <span className="ml-2 font-medium">{formData.scheduledTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Sijainti:</span>
                    <span className="ml-2 font-medium">
                      {formData.location === 'DEALERSHIP' ? 'Liikkeessämme' : 'Luoksesi'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                  Lisätietoja (valinnainen)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kerro mahdollisista erityistoiveista tai kysymyksistä..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">Koeajon ehdot:</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Koeajo kestää noin 30 minuuttia</li>
                  <li>• Tarvitset voimassa olevan ajokortin</li>
                  <li>• Koeajo on maksuton</li>
                  <li>• Voit perua varauksen 24h ennen aikaa</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Takaisin
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? 'Lähetetään...' : 'Vahvista varaus'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}