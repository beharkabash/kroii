'use client';

/**
 * Enhanced Lead Detail Page
 * Comprehensive view and management of individual customer inquiries with full communication history
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Car,
  Calendar,
  Plus,
  Edit,
  Clock,
  AlertCircle,
  Eye,
  ExternalLink,
  RefreshCw,
  Activity,
  MessageCircle,
  PhoneCall,
  Users,
  FileText,
  Settings,
  History,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  leadScore: number;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'NEGOTIATING' | 'CONVERTED' | 'LOST' | 'SPAM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  ip?: string;
  userAgent?: string;
  car?: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    priceEur: number;
    images?: Array<{ url: string; altText?: string }>;
  };
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  closedAt?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  notes: Array<{
    id: string;
    note: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  activities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
    metadata?: Record<string, unknown>;
  }>;
}

interface LeadHistory {
  id: string;
  createdAt: string;
  status: string;
  message: string;
  car?: {
    name: string;
    brand: string;
    model: string;
  };
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800 border-blue-200',
  CONTACTED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  QUALIFIED: 'bg-green-100 text-green-800 border-green-200',
  NEGOTIATING: 'bg-purple-100 text-purple-800 border-purple-200',
  CONVERTED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  LOST: 'bg-red-100 text-red-800 border-red-200',
  SPAM: 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityColors = {
  LOW: 'bg-slate-100 text-slate-800 border-slate-200',
  MEDIUM: 'bg-blue-100 text-blue-800 border-blue-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  URGENT: 'bg-red-100 text-red-800 border-red-200',
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [leadId, setLeadId] = useState<string>('');
  const [lead, setLead] = useState<ContactSubmission | null>(null);
  const [leadHistory, setLeadHistory] = useState<LeadHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Note management
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Activity management
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'NOTE_ADDED',
    description: '',
  });
  const [addingActivity, setAddingActivity] = useState(false);

  // Lead editing
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    priority: '',
    assignedToId: '',
  });
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLeadId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/leads/${leadId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lead');
      }

      const data = await response.json();
      setLead(data.lead);
      setLeadHistory(data.leadHistory || []);

      // Initialize edit data
      setEditData({
        status: data.lead.status,
        priority: data.lead.priority,
        assignedToId: data.lead.assignedTo?.id || '',
      });
    } catch (err) {
      setError('Virhe ladattaessa liidiä');
      console.error('Error fetching lead:', err);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId, fetchLead]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      const response = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      });

      if (!response.ok) throw new Error('Failed to add note');

      await fetchLead(); // Refresh data
      setNewNote('');
    } catch (_) {  
      alert('Virhe lisätessä muistiinpanoa');
    } finally {
      setAddingNote(false);
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.description.trim()) return;

    try {
      setAddingActivity(true);
      const response = await fetch(`/api/admin/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) throw new Error('Failed to add activity');

      await fetchLead(); // Refresh data
      setNewActivity({ type: 'NOTE_ADDED', description: '' });
      setShowActivityModal(false);
    } catch (_) {  
      alert('Virhe lisätessä aktiviteettia');
    } finally {
      setAddingActivity(false);
    }
  };

  const handleUpdateLead = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editData.status,
          priority: editData.priority,
          assignedToId: editData.assignedToId || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update lead');

      await fetchLead(); // Refresh data
      setEditing(false);
    } catch (_) {  
      alert('Virhe päivittäessä liidiä');
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Juuri nyt';
    if (diffMins < 60) return `${diffMins} min sitten`;
    if (diffHours < 24) return `${diffHours} h sitten`;
    if (diffDays < 7) return `${diffDays} pv sitten`;
    return formatDate(dateString);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'EMAIL_SENT': return <Mail className="h-4 w-4" />;
      case 'PHONE_CALL': return <PhoneCall className="h-4 w-4" />;
      case 'MEETING': return <Users className="h-4 w-4" />;
      case 'NOTE_ADDED': return <FileText className="h-4 w-4" />;
      case 'STATUS_CHANGED': return <Settings className="h-4 w-4" />;
      case 'CAR_SHOWN': return <Car className="h-4 w-4" />;
      case 'TEST_DRIVE': return <Car className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Ladataan liidiä...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Virhe</h2>
          <p className="text-slate-600 mb-4">{error || 'Liidiä ei löytynyt'}</p>
          <Link
            href="/admin/leads"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Takaisin liideihin
          </Link>
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
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/leads"
                  className="inline-flex items-center text-slate-600 hover:text-slate-900 transition"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Takaisin liideihin
                </Link>
                <div className="h-6 border-l border-slate-300"></div>
                <h1 className="text-3xl font-bold text-slate-900">{lead.name}</h1>

                {/* Status and Priority Badges */}
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[lead.priority]}`}>
                    {lead.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchLead}
                  className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Päivitä
                </button>

                <button
                  onClick={() => setEditing(!editing)}
                  className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editing ? 'Peruuta' : 'Muokkaa'}
                </button>

              </div>
            </div>

            {/* Lead Score and Metadata */}
            <div className="mt-4 flex items-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.leadScore)}`}>
                  Pisteet: {lead.leadScore}/100
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Luotu: {formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Päivitetty: {formatDate(lead.updatedAt)}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>Lähde: {lead.source}</span>
              </div>
            </div>
          </div>

          {/* Editing Form */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-slate-200 p-6 mb-6"
            >
              <h3 className="text-lg font-medium text-slate-900 mb-4">Muokkaa liidiä</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="NEW">Uusi</option>
                    <option value="CONTACTED">Yhteydenotettu</option>
                    <option value="QUALIFIED">Pätevöitetty</option>
                    <option value="NEGOTIATING">Neuvotellaan</option>
                    <option value="CONVERTED">Muunnettu</option>
                    <option value="LOST">Menetetty</option>
                    <option value="SPAM">Roskaposti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prioriteetti</label>
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="LOW">Matala</option>
                    <option value="MEDIUM">Keskitaso</option>
                    <option value="HIGH">Korkea</option>
                    <option value="URGENT">Kiireellinen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Osoitettu</label>
                  <input
                    type="text"
                    value={editData.assignedToId}
                    onChange={(e) => setEditData({ ...editData, assignedToId: e.target.value })}
                    placeholder="Käyttäjä-ID tai tyhjä"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Peruuta
                </button>
                <button
                  onClick={handleUpdateLead}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {saving ? 'Tallennetaan...' : 'Tallenna'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-slate-200 mb-6">
            <div className="border-b border-slate-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {[
                  { id: 'overview', label: 'Yleiskatsaus', icon: Eye },
                  { id: 'communication', label: 'Viestintä', icon: MessageCircle },
                  { id: 'activities', label: 'Aktiviteetit', icon: Activity },
                  { id: 'history', label: 'Historia', icon: History },
                ].map((tab) => (
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
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-900">Yhteystiedot</h3>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-slate-400 mr-3" />
                          <span className="text-slate-900 font-medium">{lead.name}</span>
                        </div>

                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-slate-400 mr-3" />
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-purple-600 hover:text-purple-700 transition"
                          >
                            {lead.email}
                          </a>
                        </div>

                        {lead.phone && (
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-slate-400 mr-3" />
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-purple-600 hover:text-purple-700 transition"
                            >
                              {lead.phone}
                            </a>
                          </div>
                        )}

                        {lead.assignedTo && (
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-slate-400 mr-3" />
                            <span className="text-slate-700">
                              Osoitettu: <span className="font-medium">{lead.assignedTo.name}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lead Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-900">Liidin tiedot</h3>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Pisteet:</span>
                          <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium inline-block ${getScoreColor(lead.leadScore)}`}>
                            {lead.leadScore}/100
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-600">Lähde:</span>
                          <div className="mt-1 font-medium text-slate-900">{lead.source}</div>
                        </div>

                        <div>
                          <span className="text-slate-600">Status:</span>
                          <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium inline-block ${statusColors[lead.status]}`}>
                            {lead.status}
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-600">Prioriteetti:</span>
                          <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium inline-block ${priorityColors[lead.priority]}`}>
                            {lead.priority}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-3">Asiakkaan viesti</h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
                    </div>
                  </div>

                  {/* Related Car */}
                  {lead.car && (
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-3">Kiinnostuksen kohde</h3>
                      <div className="flex items-start space-x-4 bg-slate-50 rounded-lg p-4">
                        <div className="h-20 w-32 relative rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                          {lead.car.images && lead.car.images[0] ? (
                            <Image
                              src={lead.car.images[0].url}
                              alt={lead.car.images[0].altText || lead.car.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <Car className="h-8 w-8 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-slate-900">{lead.car.name}</h4>
                          <p className="text-2xl font-bold text-purple-600 mt-1">
                            €{(lead.car.priceEur / 100).toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">{lead.car.year} • {lead.car.brand} {lead.car.model}</p>
                          <div className="flex space-x-3 mt-3">
                            <Link
                              href={`/cars/${lead.car.slug}`}
                              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 transition"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Näytä sivulla
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Communication Tab */}
              {activeTab === 'communication' && (
                <div className="space-y-6">
                  {/* Add Note Section */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-3">Lisää muistiinpano</h3>
                    <div className="space-y-3">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Kirjoita muistiinpano..."
                      />
                      <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || addingNote}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                      >
                        {addingNote ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Lisää muistiinpano
                      </button>
                    </div>
                  </div>

                  {/* Notes List */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-3">Muistiinpanot ({lead.notes.length})</h3>
                    <div className="space-y-4">
                      {lead.notes.length === 0 ? (
                        <p className="text-slate-600 text-center py-8">Ei muistiinpanoja</p>
                      ) : (
                        lead.notes.map((note) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-200 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">
                                    {note.user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{note.user.name}</p>
                                  <p className="text-xs text-slate-600">{formatDate(note.createdAt)}</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-800 whitespace-pre-wrap">{note.note}</p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Activities Tab */}
              {activeTab === 'activities' && (
                <div className="space-y-6">
                  {/* Add Activity Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-slate-900">Aktiviteetit ({lead.activities.length})</h3>
                    <button
                      onClick={() => setShowActivityModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Lisää aktiviteetti
                    </button>
                  </div>

                  {/* Activities Timeline */}
                  <div className="space-y-4">
                    {lead.activities.length === 0 ? (
                      <p className="text-slate-600 text-center py-8">Ei aktiviteetteja</p>
                    ) : (
                      lead.activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                              <p className="text-xs text-slate-600">{formatActivityDate(activity.createdAt)}</p>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">Tyyppi: {activity.type}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-slate-900">Aikaisemmat yhteydenotot</h3>

                  {leadHistory.length === 0 ? (
                    <p className="text-slate-600 text-center py-8">Ei aikaisempia yhteydenottoja tältä asiakkaalta</p>
                  ) : (
                    <div className="space-y-4">
                      {leadHistory.map((historyItem) => (
                        <motion.div
                          key={historyItem.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[historyItem.status as keyof typeof statusColors]}`}>
                                {historyItem.status}
                              </span>
                              {historyItem.car && (
                                <span className="text-sm text-slate-600">
                                  {historyItem.car.brand} {historyItem.car.model}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-600">{formatDate(historyItem.createdAt)}</span>
                          </div>
                          <p className="text-slate-800 text-sm">{historyItem.message.substring(0, 200)}...</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-medium text-slate-900 mb-4">Lisää aktiviteetti</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tyyppi</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="EMAIL_SENT">Sähköposti lähetetty</option>
                    <option value="PHONE_CALL">Puhelu</option>
                    <option value="MEETING">Tapaaminen</option>
                    <option value="NOTE_ADDED">Muistiinpano</option>
                    <option value="CAR_SHOWN">Auto esitelty</option>
                    <option value="TEST_DRIVE">Koeajo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kuvaus</label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Kuvaile aktiviteetti..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Peruuta
                </button>
                <button
                  onClick={handleAddActivity}
                  disabled={!newActivity.description.trim() || addingActivity}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {addingActivity ? 'Lisätään...' : 'Lisää'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}