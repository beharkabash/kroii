'use client';

/**
 * Admin Settings Page
 * System configuration and settings management
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Building2,
  Mail,
  Shield,
  Globe,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Zap,
  Users
} from 'lucide-react';

interface SystemConfig {
  // Business Information
  businessName: string;
  businessDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  vatNumber: string;
  businessRegistrationNumber: string;

  // Email Settings
  emailServiceEnabled: boolean;
  emailFromName: string;
  emailFromAddress: string;
  emailAutoResponderEnabled: boolean;
  emailAutoResponderSubject: string;
  emailAutoResponderMessage: string;

  // Lead Management
  leadScoringEnabled: boolean;
  leadAutoAssignmentEnabled: boolean;
  leadHighPriorityThreshold: number;
  leadNotificationEmails: string[];

  // Website Settings
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  analyticsEnabled: boolean;
  maintenanceMode: boolean;

  // Security Settings
  passwordMinLength: number;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  requireEmailVerification: boolean;

  // Feature Flags
  newsletterEnabled: boolean;
  chatbotEnabled: boolean;
  appointmentBookingEnabled: boolean;
  carComparisonEnabled: boolean;
  socialMediaIntegrationEnabled: boolean;

  // API Keys (masked)
  resendApiKey: string;
  sentryDsn: string;
  googleAnalyticsId: string;
}

const defaultConfig: SystemConfig = {
  businessName: 'Kroi Auto Center Oy',
  businessDescription: 'Luotettava kumppanisi autokaupassa Helsingissä',
  contactEmail: 'kroiautocenter@gmail.com',
  contactPhone: '+358413188214',
  address: 'Läkkisepäntie 15 B 300620, Helsinki',
  vatNumber: '',
  businessRegistrationNumber: '',

  emailServiceEnabled: true,
  emailFromName: 'Kroi Auto Center',
  emailFromAddress: 'noreply@kroiautocenter.fi',
  emailAutoResponderEnabled: true,
  emailAutoResponderSubject: 'Kiitos yhteydenotostasi - Kroi Auto Center',
  emailAutoResponderMessage: 'Kiitos yhteydenotostasi! Otamme sinuun yhteyttä mahdollisimman pian.',

  leadScoringEnabled: true,
  leadAutoAssignmentEnabled: false,
  leadHighPriorityThreshold: 70,
  leadNotificationEmails: ['kroiautocenter@gmail.com'],

  siteTitle: 'Kroi Auto Center - Käytetyt autot Helsingistä',
  siteDescription: 'Laadukkaita käytettyjä autoja Helsingistä. Kattava valikoima, kilpailukykyiset hinnat ja luotettava palvelu.',
  siteKeywords: 'käytetyt autot, auto myytävänä, Helsinki, autokauppa, Kroi Auto Center',
  analyticsEnabled: true,
  maintenanceMode: false,

  passwordMinLength: 8,
  sessionTimeoutMinutes: 1440, // 24 hours
  maxLoginAttempts: 5,
  requireEmailVerification: false,

  newsletterEnabled: true,
  chatbotEnabled: false,
  appointmentBookingEnabled: true,
  carComparisonEnabled: true,
  socialMediaIntegrationEnabled: true,

  resendApiKey: '',
  sentryDsn: '',
  googleAnalyticsId: '',
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('business');
  const [showApiKeys, setShowApiKeys] = useState(false);

  // Check if current user has permission to manage settings
  const canManageSettings = session?.user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (session?.user?.role) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      setConfig({ ...defaultConfig, ...data.settings });
      setError(null);
    } catch (err) {
      setError('Virhe ladattaessa asetuksia');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setSuccessMessage('Asetukset tallennettu onnistuneesti');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setError('Virhe tallentaessa asetuksia');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates: Partial<SystemConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const tabs = [
    { id: 'business', label: 'Yritystiedot', icon: Building2 },
    { id: 'email', label: 'Sähköpostiasetukset', icon: Mail },
    { id: 'leads', label: 'Liidien hallinta', icon: Users },
    { id: 'website', label: 'Verkkosivuasetukset', icon: Globe },
    { id: 'security', label: 'Turvallisuus', icon: Shield },
    { id: 'features', label: 'Ominaisuudet', icon: Zap },
    { id: 'integrations', label: 'Integraatiot', icon: Key },
  ];

  if (!session || !canManageSettings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Ei käyttöoikeutta</h2>
          <p className="text-slate-600">Sinulla ei ole oikeutta järjestelmäasetuksiin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                  <Settings className="mr-3 h-8 w-8 text-purple-600" />
                  Järjestelmäasetukset
                </h1>
                <p className="mt-2 text-slate-600">
                  Hallitse järjestelmän asetuksia ja konfiguraatiota
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={fetchSettings}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Päivitä
                </button>

                <button
                  onClick={saveSettings}
                  disabled={saving || loading}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
                >
                  <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-pulse' : ''}`} />
                  {saving ? 'Tallennetaan...' : 'Tallenna'}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-red-700">{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-green-700">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg border border-slate-200 mb-6">
            <div className="border-b border-slate-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Ladataan asetuksia...</p>
                </div>
              ) : (
                <>
                  {/* Business Information Tab */}
                  {activeTab === 'business' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Yritystiedot</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Yrityksen nimi</label>
                          <input
                            type="text"
                            value={config.businessName}
                            onChange={(e) => updateConfig({ businessName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Yhteyshenkilön sähköposti</label>
                          <input
                            type="email"
                            value={config.contactEmail}
                            onChange={(e) => updateConfig({ contactEmail: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Puhelinnumero</label>
                          <input
                            type="tel"
                            value={config.contactPhone}
                            onChange={(e) => updateConfig({ contactPhone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Y-tunnus</label>
                          <input
                            type="text"
                            value={config.vatNumber}
                            onChange={(e) => updateConfig({ vatNumber: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Yrityksen kuvaus</label>
                        <textarea
                          rows={3}
                          value={config.businessDescription}
                          onChange={(e) => updateConfig({ businessDescription: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Osoite</label>
                        <textarea
                          rows={2}
                          value={config.address}
                          onChange={(e) => updateConfig({ address: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email Settings Tab */}
                  {activeTab === 'email' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Sähköpostiasetukset</h3>

                      <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="emailServiceEnabled"
                          checked={config.emailServiceEnabled}
                          onChange={(e) => updateConfig({ emailServiceEnabled: e.target.checked })}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="emailServiceEnabled" className="font-medium text-slate-700">
                          Sähköpostipalvelu käytössä
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Lähettäjän nimi</label>
                          <input
                            type="text"
                            value={config.emailFromName}
                            onChange={(e) => updateConfig({ emailFromName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Lähettäjän sähköposti</label>
                          <input
                            type="email"
                            value={config.emailFromAddress}
                            onChange={(e) => updateConfig({ emailFromAddress: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <input
                            type="checkbox"
                            id="emailAutoResponderEnabled"
                            checked={config.emailAutoResponderEnabled}
                            onChange={(e) => updateConfig({ emailAutoResponderEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="emailAutoResponderEnabled" className="font-medium text-slate-700">
                            Automaattinen vastaus käytössä
                          </label>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Automaattisen vastauksen otsikko</label>
                            <input
                              type="text"
                              value={config.emailAutoResponderSubject}
                              onChange={(e) => updateConfig({ emailAutoResponderSubject: e.target.value })}
                              disabled={!config.emailAutoResponderEnabled}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Automaattisen vastauksen viesti</label>
                            <textarea
                              rows={4}
                              value={config.emailAutoResponderMessage}
                              onChange={(e) => updateConfig({ emailAutoResponderMessage: e.target.value })}
                              disabled={!config.emailAutoResponderEnabled}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Lead Management Tab */}
                  {activeTab === 'leads' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Liidien hallinta</h3>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="leadScoringEnabled"
                            checked={config.leadScoringEnabled}
                            onChange={(e) => updateConfig({ leadScoringEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="leadScoringEnabled" className="font-medium text-slate-700">
                            Automaattinen liidien pisteytys käytössä
                          </label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="leadAutoAssignmentEnabled"
                            checked={config.leadAutoAssignmentEnabled}
                            onChange={(e) => updateConfig({ leadAutoAssignmentEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="leadAutoAssignmentEnabled" className="font-medium text-slate-700">
                            Automaattinen liidien jako käyttäjille
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Korkean prioriteetin raja-arvo (0-100)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={config.leadHighPriorityThreshold}
                          onChange={(e) => updateConfig({ leadHighPriorityThreshold: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-sm text-slate-600 mt-1">
                          Liidit, joiden pisteet ylittävät tämän rajan, merkitään korkean prioriteetin liideiksi.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ilmoitussähköpostit (yksi per rivi)</label>
                        <textarea
                          rows={3}
                          value={config.leadNotificationEmails.join('\n')}
                          onChange={(e) => updateConfig({
                            leadNotificationEmails: e.target.value.split('\n').filter(email => email.trim())
                          })}
                          placeholder="admin@example.com"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-sm text-slate-600 mt-1">
                          Näihin sähköpostiosoitteisiin lähetetään ilmoitukset uusista liideistä.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Website Settings Tab */}
                  {activeTab === 'website' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Verkkosivuasetukset</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Sivuston otsikko</label>
                          <input
                            type="text"
                            value={config.siteTitle}
                            onChange={(e) => updateConfig({ siteTitle: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Sivuston kuvaus</label>
                          <textarea
                            rows={3}
                            value={config.siteDescription}
                            onChange={(e) => updateConfig({ siteDescription: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Hakusanat (pilkulla erotettuna)</label>
                          <input
                            type="text"
                            value={config.siteKeywords}
                            onChange={(e) => updateConfig({ siteKeywords: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="analyticsEnabled"
                            checked={config.analyticsEnabled}
                            onChange={(e) => updateConfig({ analyticsEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="analyticsEnabled" className="font-medium text-slate-700">
                            Analytiikka käytössä
                          </label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                          <input
                            type="checkbox"
                            id="maintenanceMode"
                            checked={config.maintenanceMode}
                            onChange={(e) => updateConfig({ maintenanceMode: e.target.checked })}
                            className="rounded border-red-300 text-red-600 focus:ring-red-500"
                          />
                          <label htmlFor="maintenanceMode" className="font-medium text-red-700">
                            Huoltotila käytössä
                          </label>
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Security Settings Tab */}
                  {activeTab === 'security' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Turvallisuusasetukset</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Salasanan minimipituus</label>
                          <input
                            type="number"
                            min="6"
                            max="32"
                            value={config.passwordMinLength}
                            onChange={(e) => updateConfig({ passwordMinLength: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Istunnon aikakatkaisu (minuuttia)</label>
                          <input
                            type="number"
                            min="5"
                            max="10080"
                            value={config.sessionTimeoutMinutes}
                            onChange={(e) => updateConfig({ sessionTimeoutMinutes: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Maksimi kirjautumisyritykset</label>
                          <input
                            type="number"
                            min="3"
                            max="20"
                            value={config.maxLoginAttempts}
                            onChange={(e) => updateConfig({ maxLoginAttempts: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="requireEmailVerification"
                          checked={config.requireEmailVerification}
                          onChange={(e) => updateConfig({ requireEmailVerification: e.target.checked })}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="requireEmailVerification" className="font-medium text-slate-700">
                          Vaadi sähköpostin vahvistus uusille käyttäjille
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Features Tab */}
                  {activeTab === 'features' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Ominaisuudet</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="newsletterEnabled"
                            checked={config.newsletterEnabled}
                            onChange={(e) => updateConfig({ newsletterEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="newsletterEnabled" className="font-medium text-slate-700">
                            Uutiskirje käytössä
                          </label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="chatbotEnabled"
                            checked={config.chatbotEnabled}
                            onChange={(e) => updateConfig({ chatbotEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="chatbotEnabled" className="font-medium text-slate-700">
                            Chatbot käytössä
                          </label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="appointmentBookingEnabled"
                            checked={config.appointmentBookingEnabled}
                            onChange={(e) => updateConfig({ appointmentBookingEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="appointmentBookingEnabled" className="font-medium text-slate-700">
                            Ajanvaraus käytössä
                          </label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="carComparisonEnabled"
                            checked={config.carComparisonEnabled}
                            onChange={(e) => updateConfig({ carComparisonEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="carComparisonEnabled" className="font-medium text-slate-700">
                            Autojen vertailu käytössä
                          </label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="socialMediaIntegrationEnabled"
                            checked={config.socialMediaIntegrationEnabled}
                            onChange={(e) => updateConfig({ socialMediaIntegrationEnabled: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="socialMediaIntegrationEnabled" className="font-medium text-slate-700">
                            Sosiaalisen median integraatio
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Integrations Tab */}
                  {activeTab === 'integrations' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-slate-900">API-avaimet ja integraatiot</h3>
                        <button
                          onClick={() => setShowApiKeys(!showApiKeys)}
                          className="inline-flex items-center px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                        >
                          {showApiKeys ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                          {showApiKeys ? 'Piilota' : 'Näytä'} avaimet
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Resend API-avain</label>
                          <input
                            type={showApiKeys ? 'text' : 'password'}
                            value={config.resendApiKey}
                            onChange={(e) => updateConfig({ resendApiKey: e.target.value })}
                            placeholder="re_xxxxxxxxxxxxxxxx"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          />
                          <p className="text-sm text-slate-600 mt-1">
                            Sähköpostin lähetykseen käytettävä Resend-palvelun API-avain.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Sentry DSN</label>
                          <input
                            type={showApiKeys ? 'text' : 'password'}
                            value={config.sentryDsn}
                            onChange={(e) => updateConfig({ sentryDsn: e.target.value })}
                            placeholder="https://xxxxxxxx@xxxxxxxx.ingest.sentry.io/xxxxxxxx"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          />
                          <p className="text-sm text-slate-600 mt-1">
                            Virheiden seurantaan käytettävä Sentry DSN.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Google Analytics ID</label>
                          <input
                            type={showApiKeys ? 'text' : 'password'}
                            value={config.googleAnalyticsId}
                            onChange={(e) => updateConfig({ googleAnalyticsId: e.target.value })}
                            placeholder="G-XXXXXXXXXX"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          />
                          <p className="text-sm text-slate-600 mt-1">
                            Google Analytics -seurantaan käytettävä mittaustunnus.
                          </p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800">Turvallisuushuomautus</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              API-avaimet tallennetaan turvallisesti salattuina. Älä jaa näitä avaimia kenenkään kanssa.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}