'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Mail,
  Phone,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Edit,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
    inventoryAlerts: boolean;
    marketingEmails: boolean;
    newsletter: boolean;
  };
  stats: {
    joinedAt: string;
    favoriteCount: number;
    inquiryCount: number;
    alertCount: number;
  };
}

export default function CustomerProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/customer/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (_error) {
      console.error('Error fetching profile:', _error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile: Partial<CustomerProfile>) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
        setMessage({ type: 'success', text: 'Profiili päivitetty onnistuneesti!' });

        // Update session if name changed
        if (updatedProfile.firstName || updatedProfile.lastName) {
          update();
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Päivitys epäonnistui' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'Verkkovirhe. Yritä uudelleen.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Uudet salasanat eivät täsmää' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Salasanan tulee olla vähintään 8 merkkiä pitkä' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/customer/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Salasana vaihdettu onnistuneesti!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Salasanan vaihto epäonnistui' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'Verkkovirhe. Yritä uudelleen.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Ladataan profiilia...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Profiilia ei voitu ladata</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Perustiedot', icon: User },
    { id: 'preferences', name: 'Asetukset', icon: Bell },
    { id: 'security', name: 'Turvallisuus', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <User className="h-6 w-6 text-purple-500 mr-2" />
                Oma profiili
              </h1>
              <p className="text-slate-600 mt-1">
                Hallitse tilin asetuksia ja mieltymyksiä
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-sm text-slate-600">{profile.email}</p>
                <p className="text-xs text-slate-500 mt-2 flex items-center justify-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Liittynyt {new Date(profile.stats.joinedAt).toLocaleDateString('fi-FI')}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{profile.stats.favoriteCount}</div>
                  <div className="text-xs text-slate-600">Suosikkia</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{profile.stats.inquiryCount}</div>
                  <div className="text-xs text-slate-600">Yhteydenottoa</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{profile.stats.alertCount}</div>
                  <div className="text-xs text-slate-600">Aktiivista hälytysta</div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-900'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <tab.icon className={`mr-3 h-4 w-4 ${
                      activeTab === tab.id ? 'text-purple-500' : 'text-slate-400'
                    }`} />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* Message */}
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg border ${
                    message.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <div className="flex items-center">
                    {message.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    {message.text}
                  </div>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Perustiedot</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Etunimi
                      </label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sukunimi
                      </label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sähköposti
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                          className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Puhelinnumero
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Valinnainen"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => handleProfileUpdate({
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        email: profile.email,
                        phone: profile.phone
                      })}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Tallenna muutokset
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Ilmoitusasetukset</h2>

                  <div className="space-y-6">
                    <div className="border border-slate-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Sähköposti-ilmoitukset</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profile.preferences.inventoryAlerts}
                            onChange={(e) => setProfile(prev => prev ? {
                              ...prev,
                              preferences: { ...prev.preferences, inventoryAlerts: e.target.checked }
                            } : null)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                          />
                          <span className="ml-2 text-sm text-slate-700">Uudet autot, jotka vastaavat hakukriteereitäni</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profile.preferences.marketingEmails}
                            onChange={(e) => setProfile(prev => prev ? {
                              ...prev,
                              preferences: { ...prev.preferences, marketingEmails: e.target.checked }
                            } : null)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                          />
                          <span className="ml-2 text-sm text-slate-700">Markkinointi ja tarjoukset</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profile.preferences.newsletter}
                            onChange={(e) => setProfile(prev => prev ? {
                              ...prev,
                              preferences: { ...prev.preferences, newsletter: e.target.checked }
                            } : null)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                          />
                          <span className="ml-2 text-sm text-slate-700">Uutiskirje ja vinkit</span>
                        </label>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-slate-900 mb-4">WhatsApp & SMS</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profile.preferences.whatsappNotifications}
                            onChange={(e) => setProfile(prev => prev ? {
                              ...prev,
                              preferences: { ...prev.preferences, whatsappNotifications: e.target.checked }
                            } : null)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                            disabled={!profile.phone}
                          />
                          <span className="ml-2 text-sm text-slate-700">
                            WhatsApp-ilmoitukset {!profile.phone && '(vaatii puhelinnumeron)'}
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profile.preferences.smsNotifications}
                            onChange={(e) => setProfile(prev => prev ? {
                              ...prev,
                              preferences: { ...prev.preferences, smsNotifications: e.target.checked }
                            } : null)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                            disabled={!profile.phone}
                          />
                          <span className="ml-2 text-sm text-slate-700">
                            SMS-ilmoitukset {!profile.phone && '(vaatii puhelinnumeron)'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => handleProfileUpdate({ preferences: profile.preferences })}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Tallenna asetukset
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Turvallisuus</h2>

                  <div className="space-y-6">
                    <div className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-900">Salasana</h3>
                          <p className="text-sm text-slate-600">Vaihda tilin salasana</p>
                        </div>
                        <button
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                          className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Vaihda salasana
                        </button>
                      </div>

                      {showPasswordForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nykyinen salasana
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.current ? 'text' : 'password'}
                                  value={passwordForm.currentPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                  className="w-full pr-10 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Uusi salasana
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.new ? 'text' : 'password'}
                                  value={passwordForm.newPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                  className="w-full pr-10 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Vahvista uusi salasana
                              </label>
                              <div className="relative">
                                <input
                                  type={showPasswords.confirm ? 'text' : 'password'}
                                  value={passwordForm.confirmPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  className="w-full pr-10 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            <div className="flex space-x-3">
                              <button
                                onClick={handlePasswordChange}
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              >
                                {saving ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                ) : (
                                  <Save className="h-4 w-4 mr-2" />
                                )}
                                Vaihda salasana
                              </button>
                              <button
                                onClick={() => {
                                  setShowPasswordForm(false);
                                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                              >
                                Peruuta
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}