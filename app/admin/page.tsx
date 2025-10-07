'use client';

/**
 * Admin Dashboard
 * Main overview dashboard for admin users
 */

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalCars: number;
  availableCars: number;
  soldCars: number;
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  monthlyViews: number;
  weeklyViews: number;
  averagePrice: number;
  totalValue: number;
}

interface RecentActivity {
  id: string;
  type: 'car_view' | 'lead_created' | 'car_sold' | 'user_login';
  message: string;
  timestamp: string;
  icon: React.ElementType;
  color: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // For now, we'll use mock data. In a real implementation,
        // these would be API calls to get actual statistics
        setStats({
          totalCars: 9,
          availableCars: 8,
          soldCars: 1,
          totalLeads: 12,
          newLeads: 3,
          convertedLeads: 2,
          monthlyViews: 1250,
          weeklyViews: 320,
          averagePrice: 17500,
          totalValue: 157500
        });

        setRecentActivity([
          {
            id: '1',
            type: 'lead_created',
            message: 'Uusi yhteydenotto BMW 318:sta',
            timestamp: '5 min sitten',
            icon: MessageSquare,
            color: 'text-blue-600'
          },
          {
            id: '2',
            type: 'car_view',
            message: 'Audi Q3 näytetty 15 kertaa tänään',
            timestamp: '1 tunti sitten',
            icon: Eye,
            color: 'text-green-600'
          },
          {
            id: '3',
            type: 'user_login',
            message: 'Admin kirjautui sisään',
            timestamp: '2 tuntia sitten',
            icon: Users,
            color: 'text-purple-600'
          },
          {
            id: '4',
            type: 'car_sold',
            message: 'Volkswagen Tiguan myyty',
            timestamp: '1 päivä sitten',
            icon: CheckCircle,
            color: 'text-green-600'
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: 'Autot yhteensä',
      value: stats?.totalCars || 0,
      change: '+2 tässä kuussa',
      changeType: 'positive',
      icon: Car,
      color: 'from-blue-600 to-blue-700',
      href: '/admin/cars'
    },
    {
      name: 'Saatavilla olevat',
      value: stats?.availableCars || 0,
      change: `${stats?.soldCars || 0} myyty`,
      changeType: 'neutral',
      icon: CheckCircle,
      color: 'from-green-600 to-green-700',
      href: '/admin/cars?status=available'
    },
    {
      name: 'Asiakasviestit',
      value: stats?.totalLeads || 0,
      change: `${stats?.newLeads || 0} uutta`,
      changeType: 'positive',
      icon: MessageSquare,
      color: 'from-purple-600 to-purple-700',
      href: '/admin/leads'
    },
    {
      name: 'Kuukausikatsaukset',
      value: stats?.monthlyViews || 0,
      change: `${stats?.weeklyViews || 0} tällä viikolla`,
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-yellow-600 to-yellow-700',
      href: '/admin/analytics'
    }
  ];

  const quickActions = [
    {
      name: 'Lisää uusi auto',
      description: 'Lisää uusi auto myyntiin',
      href: '/admin/cars/new',
      icon: Car,
      color: 'bg-blue-500',
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: 'Vastaa viesteihin',
      description: 'Käsittele uusia asiakasviestejä',
      href: '/admin/leads?status=NEW',
      icon: MessageSquare,
      color: 'bg-purple-500',
      roles: ['SUPER_ADMIN', 'ADMIN', 'VIEWER']
    },
    {
      name: 'Katso analytiikkaa',
      description: 'Tarkastele myyntiraportteja',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-green-500',
      roles: ['SUPER_ADMIN', 'ADMIN', 'VIEWER']
    },
    {
      name: 'Hallitse käyttäjiä',
      description: 'Lisää tai muokkaa käyttäjiä',
      href: '/admin/users',
      icon: Users,
      color: 'bg-red-500',
      roles: ['SUPER_ADMIN']
    }
  ];

  const userRole = session?.user?.role;
  const visibleActions = quickActions.filter(action =>
    action.roles.includes(userRole || '')
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Tervetuloa, {session?.user?.name || 'Admin'}!
            </h1>
            <p className="text-purple-100 text-lg">
              Tässä on yleiskatsaus autokauppasi tilaan
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={card.href}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {card.name}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {card.value.toLocaleString()}
                    </p>
                    <p className={`text-sm mt-2 ${
                      card.changeType === 'positive' ? 'text-green-600' :
                      card.changeType === 'negative' ? 'text-red-600' : 'text-slate-500'
                    }`}>
                      {card.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Pikavalinnat
          </h2>
          <div className="space-y-4">
            {visibleActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {action.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Viimeisimmät tapahtumat
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className={`p-2 rounded-lg bg-slate-100 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/admin/analytics"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Näytä kaikki tapahtumat →
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Suorituskyvyn yleiskatsaus
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              €{stats?.averagePrice.toLocaleString() || 0}
            </div>
            <div className="text-sm text-slate-600">Keskihinta</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              €{stats?.totalValue.toLocaleString() || 0}
            </div>
            <div className="text-sm text-slate-600">Kokonaisarvo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(((stats?.convertedLeads || 0) / (stats?.totalLeads || 1)) * 100)}%
            </div>
            <div className="text-sm text-slate-600">Konversioprosentti</div>
          </div>
        </div>
      </div>
    </div>
  );
}