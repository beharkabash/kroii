'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Search,
  MessageSquare,
  Bell,
  User,
  Eye,
  Calendar,
  TrendingUp,
  Star,
  ArrowRight,
  Car,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardData {
  stats: {
    favoriteCount: number;
    savedSearchCount: number;
    inquiryCount: number;
    alertCount: number;
  };
  recentFavorites: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    addedAt: string;
  }>;
  recentInquiries: Array<{
    id: string;
    vehicleName: string;
    message: string;
    status: string;
    createdAt: string;
  }>;
  recommendations: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    reason: string;
  }>;
  alerts: Array<{
    id: string;
    message: string;
    type: string;
    createdAt: string;
  }>;
}

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'CUSTOMER') {
      router.push('/customer/auth/login');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/customer/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Ladataan kojelauta...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userName = session.user?.name || 'Asiakas';
  const firstName = userName.split(' ')[0];

  // Mock data if API fails
  const defaultData: DashboardData = {
    stats: { favoriteCount: 3, savedSearchCount: 2, inquiryCount: 5, alertCount: 1 },
    recentFavorites: [
      { id: '1', name: 'BMW 320d 2018', price: 28500, image: '/images/placeholder-car.jpg', addedAt: '2024-01-15' },
      { id: '2', name: 'Audi A4 2019', price: 32000, image: '/images/placeholder-car.jpg', addedAt: '2024-01-14' },
    ],
    recentInquiries: [
      { id: '1', vehicleName: 'BMW 320d 2018', message: 'Kiinnostunut koeajosta', status: 'NEW', createdAt: '2024-01-15' },
    ],
    recommendations: [
      { id: '1', name: 'Volkswagen Golf 2019', price: 24500, image: '/images/placeholder-car.jpg', reason: 'Samankaltainen kuin suosikkisi' },
    ],
    alerts: [
      { id: '1', message: 'Uusi BMW 3-sarjan auto vastaa hakukriteereitäsi', type: 'inventory', createdAt: '2024-01-15' },
    ]
  };

  const data = dashboardData || defaultData;

  const quickActions = [
    {
      title: 'Selaa autoja',
      description: 'Löydä unelmiesi auto',
      icon: Car,
      href: '/inventory',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Tallenna haku',
      description: 'Saa ilmoituksia uusista autoista',
      icon: Search,
      href: '/customer/searches',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Vertaile autoja',
      description: 'Vertaile ominaisuuksia',
      icon: TrendingUp,
      href: '/compare',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Rahoituslaskin',
      description: 'Laske kuukausierä',
      icon: Calendar,
      href: '/financing',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Tervetuloa takaisin, {firstName}!
              </h1>
              <p className="text-slate-600 mt-1">
                Tässä on yhteenveto toiminnastasi
              </p>
            </div>
            <Link
              href="/customer/profile"
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              <User className="h-4 w-4 mr-2" />
              Profiili
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Suosikit', value: data.stats.favoriteCount, icon: Heart, color: 'text-red-600', bg: 'bg-red-100' },
            { title: 'Tallennetut haut', value: data.stats.savedSearchCount, icon: Search, color: 'text-blue-600', bg: 'bg-blue-100' },
            { title: 'Yhteydenotot', value: data.stats.inquiryCount, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100' },
            { title: 'Aktiiviset hälytykset', value: data.stats.alertCount, icon: Bell, color: 'text-yellow-600', bg: 'bg-yellow-100' }
          ].map((stat, _index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: _index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Pikavalinnat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, _index) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden rounded-lg p-6 bg-gradient-to-r hover:shadow-lg transition-all duration-200"
                style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10">
                  <action.icon className="h-8 w-8 text-white mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">{action.title}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                  <ArrowRight className="h-4 w-4 text-white mt-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Favorites */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Viimeisimmät suosikit</h2>
              <Link
                href="/customer/favorites"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
              >
                Näytä kaikki
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {data.recentFavorites.map((favorite, _index) => (
                <div key={favorite.id} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg transition">
                  <img
                    src={favorite.image}
                    alt={favorite.name}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{favorite.name}</h3>
                    <p className="text-sm text-slate-600">€{favorite.price.toLocaleString()}</p>
                  </div>
                  <Link
                    href={`/cars/${favorite.id}`}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Inquiries */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Viimeisimmät yhteydenotot</h2>
              <Link
                href="/customer/inquiries"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
              >
                Näytä kaikki
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {data.recentInquiries.map((inquiry, _index) => (
                <div key={inquiry.id} className="p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900">{inquiry.vehicleName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                      inquiry.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status === 'NEW' ? 'Uusi' :
                       inquiry.status === 'CONTACTED' ? 'Otettu yhteyttä' : 'Käsitelty'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{inquiry.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(inquiry.createdAt).toLocaleDateString('fi-FI')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommendations & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6"
          >
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-slate-900">Suositukset sinulle</h2>
            </div>

            <div className="space-y-4">
              {data.recommendations.map((recommendation, _index) => (
                <div key={recommendation.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img
                      src={recommendation.image}
                      alt={recommendation.name}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{recommendation.name}</h3>
                      <p className="text-sm text-slate-600">€{recommendation.price.toLocaleString()}</p>
                      <p className="text-xs text-purple-600 mt-1">{recommendation.reason}</p>
                    </div>
                    <Link
                      href={`/cars/${recommendation.id}`}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Bell className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-slate-900">Aktiiviset hälytykset</h2>
              </div>
              <Link
                href="/customer/alerts"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Hallitse
              </Link>
            </div>

            <div className="space-y-3">
              {data.alerts.map((alert, _index) => (
                <div key={alert.id} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                  <p className="text-sm text-slate-900 font-medium">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(alert.createdAt).toLocaleDateString('fi-FI')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}