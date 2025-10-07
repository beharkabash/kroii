'use client';

/**
 * Admin Leads Management Page
 * CRM system for managing customer inquiries and contact submissions
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Car,
  Clock,
  Star,
  TrendingUp,
  Eye,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

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
  car?: {
    id: string;
    name: string;
    brand: string;
    model: string;
    priceEur: number;
  };
  createdAt: string;
  respondedAt?: string;
  assignedTo?: {
    name: string;
    email: string;
  };
  notes: Array<{
    id: string;
    note: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
}

type FilterStatus = 'all' | 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'NEGOTIATING' | 'CONVERTED' | 'LOST';
type SortField = 'createdAt' | 'leadScore' | 'name' | 'status';
type SortOrder = 'asc' | 'desc';

export default function AdminLeadsPage() {
  useSession();
  const [leads, setLeads] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    avgLeadScore: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    fetchLeads();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, sortField, sortOrder, searchQuery]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real implementation, this would be an API call
      const mockLeads: ContactSubmission[] = [
        {
          id: '1',
          name: 'Matti Meikäläinen',
          email: 'matti@example.com',
          phone: '+358401234567',
          message: 'Kiinnostunut BMW 318:sta. Voisinko saada lisätietoja hinnasta ja mahdollisuudesta koeajoon?',
          leadScore: 85,
          source: 'contact_form',
          status: 'NEW',
          priority: 'HIGH',
          car: {
            id: 'bmw-318-2017',
            name: 'BMW 318',
            brand: 'BMW',
            model: '318',
            priceEur: 14100
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          notes: []
        },
        {
          id: '2',
          name: 'Anna Virtanen',
          email: 'anna.virtanen@email.com',
          phone: '+358503456789',
          message: 'Hei! Etsin perheen ensimmäistä autoa. Skoda Octavia näytti mielenkiintoiselta.',
          leadScore: 72,
          source: 'contact_form',
          status: 'CONTACTED',
          priority: 'MEDIUM',
          car: {
            id: 'skoda-octavia-2018',
            name: 'Skoda Octavia 2.0 TDI',
            brand: 'Skoda',
            model: 'Octavia 2.0 TDI',
            priceEur: 14000
          },
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          respondedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          assignedTo: {
            name: 'Admin User',
            email: 'admin@kroiautocenter.fi'
          },
          notes: [
            {
              id: 'note1',
              note: 'Soitti takaisin. Kiinnostunut koeajosta viikonloppuna.',
              createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              user: { name: 'Admin User' }
            }
          ]
        },
        {
          id: '3',
          name: 'Jukka Korhonen',
          email: 'jukka.korhonen@company.com',
          message: 'Etsimme yrityksellemme käytettyä pakettiautoa tai suurempaa henkilöautoa.',
          leadScore: 65,
          source: 'contact_form',
          status: 'QUALIFIED',
          priority: 'MEDIUM',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          notes: []
        }
      ];

      // Apply filters
      let filteredLeads = mockLeads;

      if (filterStatus !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === filterStatus);
      }

      if (searchQuery) {
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.message.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply sorting
      filteredLeads.sort((a, b) => {
        let aValue: string | number | Date, bValue: string | number | Date;

        switch (sortField) {
          case 'leadScore':
            aValue = a.leadScore;
            bValue = b.leadScore;
            break;
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setLeads(filteredLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Mock stats - in real implementation, this would be an API call
    setStats({
      total: 12,
      new: 3,
      contacted: 4,
      qualified: 2,
      converted: 2,
      avgLeadScore: 73,
      avgResponseTime: 4.2 // hours
    });
  };

  const getStatusBadge = (status: string, priority?: string) => {
    const statusConfig = {
      NEW: { color: 'bg-red-100 text-red-800', text: 'Uusi' },
      CONTACTED: { color: 'bg-blue-100 text-blue-800', text: 'Yhteydenotto' },
      QUALIFIED: { color: 'bg-yellow-100 text-yellow-800', text: 'Hyväksytty' },
      NEGOTIATING: { color: 'bg-purple-100 text-purple-800', text: 'Neuvottelu' },
      CONVERTED: { color: 'bg-green-100 text-green-800', text: 'Myyty' },
      LOST: { color: 'bg-gray-100 text-gray-800', text: 'Menetetty' },
      SPAM: { color: 'bg-red-100 text-red-800', text: 'Roskaposti' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW;

    return (
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.text}
        </span>
        {priority === 'URGENT' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            Kiireellinen
          </span>
        )}
        {priority === 'HIGH' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Korkea
          </span>
        )}
      </div>
    );
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Alle tunti sitten';
    if (diffInHours < 24) return `${diffInHours} tuntia sitten`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Eilen';
    if (diffInDays < 7) return `${diffInDays} päivää sitten`;

    return date.toLocaleDateString('fi-FI');
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Asiakasviestit</h1>
          <p className="text-slate-600 mt-1">
            {leads.length} viestiä yhteensä
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition">
            <Download className="h-4 w-4 mr-2" />
            Lataa CSV
          </button>
          <button
            onClick={fetchLeads}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Päivitä
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Uudet viestit', value: stats.new, icon: MessageSquare, color: 'from-red-500 to-red-600' },
          { name: 'Keskimääräinen pistemäärä', value: `${stats.avgLeadScore}/100`, icon: Star, color: 'from-yellow-500 to-yellow-600' },
          { name: 'Konversio', value: `${Math.round((stats.converted / stats.total) * 100)}%`, icon: TrendingUp, color: 'from-green-500 to-green-600' },
          { name: 'Vasteaika', value: `${stats.avgResponseTime}h`, icon: Clock, color: 'from-blue-500 to-blue-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Hae viestejä..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Kaikki tilat</option>
              <option value="NEW">Uudet</option>
              <option value="CONTACTED">Yhteydessä</option>
              <option value="QUALIFIED">Hyväksytyt</option>
              <option value="NEGOTIATING">Neuvottelussa</option>
              <option value="CONVERTED">Myyty</option>
              <option value="LOST">Menetetty</option>
            </select>

            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortField(field as SortField);
                setSortOrder(order as SortOrder);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="createdAt-desc">Uusimmat ensin</option>
              <option value="createdAt-asc">Vanhimmat ensin</option>
              <option value="leadScore-desc">Paras pistemäärä</option>
              <option value="leadScore-asc">Huonoin pistemäärä</option>
              <option value="name-asc">Nimi A-Z</option>
              <option value="name-desc">Nimi Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-900">
              {selectedLeads.length} viestiä valittu
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition">
                Merkitse yhteydessä
              </button>
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
                Merkitse hyväksytty
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">
                Merkitse roskaposti
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === leads.length && leads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Asiakas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Auto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tila
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Pistemäärä
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Saapunut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Toiminnot
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {leads.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-sm text-slate-500 hover:text-purple-600 flex items-center"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </a>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-sm text-slate-500 hover:text-purple-600 flex items-center"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              {lead.phone}
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                          {lead.message}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.car ? (
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{lead.car.name}</p>
                          <p className="text-sm text-slate-500">€{lead.car.priceEur.toLocaleString()}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Yleinen kysely</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status, lead.priority)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getLeadScoreColor(lead.leadScore)}`}>
                        {lead.leadScore}/100
                      </span>
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            lead.leadScore >= 80 ? 'bg-green-500' :
                            lead.leadScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${lead.leadScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{formatTimeAgo(lead.createdAt)}</div>
                    {lead.respondedAt && (
                      <div className="text-xs text-green-600 mt-1">
                        Vastattu {formatTimeAgo(lead.respondedAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="p-2 text-slate-400 hover:text-slate-600 transition"
                        title="Näytä yksityiskohdat"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <a
                        href={`mailto:${lead.email}`}
                        className="p-2 text-blue-400 hover:text-blue-600 transition"
                        title="Lähetä sähköposti"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-2 text-green-400 hover:text-green-600 transition"
                          title="Soita"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        className="p-2 text-slate-400 hover:text-slate-600 transition"
                        title="Lisää toimintoja"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {leads.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Ei viestejä löytynyt
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Yritä eri hakusanoja' : 'Uusia asiakasviestejä ei ole vielä saapunut'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}