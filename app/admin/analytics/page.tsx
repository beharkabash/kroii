'use client';

/**
 * Analytics Dashboard
 * Comprehensive analytics and reporting for car dealership
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Users,
  Clock,
  Target,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    totalLeads: number;
    conversionRate: number;
    avgTimeOnSite: number;
    bounceRate: number;
  };
  carPerformance: Array<{
    id: string;
    name: string;
    views: number;
    inquiries: number;
    conversionRate: number;
    avgTimeViewing: number;
  }>;
  leadSources: Array<{
    source: string;
    count: number;
    percentage: number;
    conversionRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    views: number;
    leads: number;
    conversions: number;
  }>;
  topBrands: Array<{
    brand: string;
    views: number;
    inquiries: number;
    avgPrice: number;
  }>;
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedMetric, setSelectedMetric] = useState('views');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Mock analytics data - in real implementation, this would be API calls
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 3420,
          uniqueVisitors: 2150,
          totalLeads: 48,
          conversionRate: 2.2,
          avgTimeOnSite: 3.5,
          bounceRate: 42
        },
        carPerformance: [
          {
            id: 'bmw-318-2017',
            name: 'BMW 318',
            views: 485,
            inquiries: 12,
            conversionRate: 2.5,
            avgTimeViewing: 2.8
          },
          {
            id: 'audi-q3-2018',
            name: 'Audi Q3 2.0 TDI',
            views: 392,
            inquiries: 8,
            conversionRate: 2.0,
            avgTimeViewing: 3.2
          },
          {
            id: 'vw-tiguan-2020',
            name: 'Volkswagen Tiguan',
            views: 356,
            inquiries: 15,
            conversionRate: 4.2,
            avgTimeViewing: 4.1
          },
          {
            id: 'skoda-octavia-2018',
            name: 'Skoda Octavia 2.0 TDI',
            views: 298,
            inquiries: 6,
            conversionRate: 2.0,
            avgTimeViewing: 2.4
          },
          {
            id: 'mercedes-e220-2017',
            name: 'Mercedes-Benz E220 d A',
            views: 267,
            inquiries: 4,
            conversionRate: 1.5,
            avgTimeViewing: 3.8
          }
        ],
        leadSources: [
          { source: 'Yhteydenottolomake', count: 28, percentage: 58.3, conversionRate: 3.2 },
          { source: 'WhatsApp', count: 12, percentage: 25.0, conversionRate: 4.1 },
          { source: 'Puhelin', count: 8, percentage: 16.7, conversionRate: 5.8 }
        ],
        monthlyTrends: [
          { month: 'Heinäkuu', views: 2890, leads: 32, conversions: 2 },
          { month: 'Elokuu', views: 3120, leads: 41, conversions: 3 },
          { month: 'Syyskuu', views: 3420, leads: 48, conversions: 4 },
          { month: 'Lokakuu', views: 2840, leads: 28, conversions: 2 }
        ],
        topBrands: [
          { brand: 'BMW', views: 682, inquiries: 18, avgPrice: 16500 },
          { brand: 'Volkswagen', views: 598, inquiries: 21, avgPrice: 24750 },
          { brand: 'Skoda', views: 526, inquiries: 14, avgPrice: 12167 },
          { brand: 'Audi', views: 392, inquiries: 8, avgPrice: 27250 },
          { brand: 'Mercedes-Benz', views: 267, inquiries: 4, avgPrice: 14000 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: '7 päivää' },
    { value: '30d', label: '30 päivää' },
    { value: '90d', label: '90 päivää' },
    { value: '1y', label: '1 vuosi' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Analytiikka ei saatavilla
        </h3>
        <p className="text-slate-500">
          Analytiikkatietoja ei voitu ladata
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytiikka</h1>
          <p className="text-slate-600 mt-1">
            Autokauppasi suorituskyvyn seuranta
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Päivitä
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <Download className="h-4 w-4 mr-2" />
            Lataa raportti
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: 'Sivukatsaukset',
            value: analyticsData.overview.totalViews.toLocaleString(),
            change: '+12%',
            changeType: 'positive' as const,
            icon: Eye,
            color: 'from-blue-500 to-blue-600'
          },
          {
            name: 'Yksittäiset vierailijat',
            value: analyticsData.overview.uniqueVisitors.toLocaleString(),
            change: '+8%',
            changeType: 'positive' as const,
            icon: Users,
            color: 'from-purple-500 to-purple-600'
          },
          {
            name: 'Yhteydenotot',
            value: analyticsData.overview.totalLeads.toString(),
            change: '+24%',
            changeType: 'positive' as const,
            icon: MessageSquare,
            color: 'from-green-500 to-green-600'
          },
          {
            name: 'Konversiosuhde',
            value: `${analyticsData.overview.conversionRate}%`,
            change: '+0.3%',
            changeType: 'positive' as const,
            icon: Target,
            color: 'from-yellow-500 to-yellow-600'
          },
          {
            name: 'Keskimääräinen käyntiaika',
            value: `${analyticsData.overview.avgTimeOnSite} min`,
            change: '+15%',
            changeType: 'positive' as const,
            icon: Clock,
            color: 'from-indigo-500 to-indigo-600'
          },
          {
            name: 'Poistumisnopeus',
            value: `${analyticsData.overview.bounceRate}%`,
            change: '-5%',
            changeType: 'positive' as const,
            icon: TrendingDown,
            color: 'from-red-500 to-red-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 flex items-center ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {stat.change} edelliseen kauteen
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Car Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Autojen suorituskyky
            </h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="views">Katsaukset</option>
              <option value="inquiries">Yhteydenotot</option>
              <option value="conversion">Konversio</option>
            </select>
          </div>

          <div className="space-y-4">
            {analyticsData.carPerformance.map((car, index) => {
              const metricValue = selectedMetric === 'views' ? car.views :
                               selectedMetric === 'inquiries' ? car.inquiries :
                               car.conversionRate;

              const maxValue = Math.max(...analyticsData.carPerformance.map(c =>
                selectedMetric === 'views' ? c.views :
                selectedMetric === 'inquiries' ? c.inquiries :
                c.conversionRate
              ));

              const percentage = (metricValue / maxValue) * 100;

              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900">{car.name}</p>
                      <span className="text-sm font-semibold text-slate-700">
                        {selectedMetric === 'conversion' ? `${metricValue}%` : metricValue}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{car.views} katsausta</span>
                      <span>{car.inquiries} yhteydenottoa</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Yhteydenottojen lähteet
          </h2>

          <div className="space-y-4">
            {analyticsData.leadSources.map((source, index) => (
              <motion.div
                key={source.source}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900">{source.source}</p>
                    <span className="text-sm font-semibold text-purple-600">
                      {source.count} yhteydenottoa
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{source.percentage}% kaikista</span>
                    <span>{source.conversionRate}% konversio</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Kuukausittaiset trendit
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {analyticsData.monthlyTrends.map((month, index) => (
            <motion.div
              key={month.month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg"
            >
              <h3 className="font-semibold text-slate-900 mb-3">{month.month}</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{month.views.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Katsaukset</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-600">{month.leads}</p>
                  <p className="text-sm text-slate-600">Yhteydenotot</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-600">{month.conversions}</p>
                  <p className="text-sm text-slate-600">Myynnit</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Brands */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Suosituimmat automerkit
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Merkki</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">Katsaukset</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">Yhteydenotot</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">Keskihinta</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">Konversio</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topBrands.map((brand, index) => {
                const conversionRate = brand.inquiries > 0 ? (brand.inquiries / brand.views * 100) : 0;

                return (
                  <motion.tr
                    key={brand.brand}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {brand.brand.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">{brand.brand}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      {brand.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      {brand.inquiries}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">
                      €{brand.avgPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        conversionRate >= 3 ? 'bg-green-100 text-green-800' :
                        conversionRate >= 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {conversionRate.toFixed(1)}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Keskeisiä huomioita
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                Volkswagen Tiguan -mallilla korkein konversioprosentti (4.2%)
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                BMW 318 saa eniten katsauksia - optimoi hinnoittelua
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                WhatsApp-yhteydenottojen määrä kasvussa (+34% kuukaudessa)
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                Keskimääräinen käyntiaika nousussa - sisältö kiinnostaa
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            Suositukset
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                <strong>Lisää BMW 318:n kuvia</strong> - paljon katsauksia, vähän yhteydenottoja
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                <strong>Korosta VW Tiguan</strong> - paras konversioprosentti
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                <strong>Optimoi WhatsApp-nappi</strong> - kasvava yhteydenottokanava
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                <strong>Lisää Audi valikoimaa</strong> - korkea keskihinta, vähän tarjontaa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Goals */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Kuukausittaiset tavoitteet
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Sivukatsaukset', current: 3420, target: 4000, unit: '' },
            { name: 'Yhteydenotot', current: 48, target: 60, unit: '' },
            { name: 'Myynnit', current: 4, target: 6, unit: '' },
            { name: 'Konversio', current: 2.2, target: 3.0, unit: '%' }
          ].map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const isOnTrack = progress >= 75;

            return (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4"
              >
                <h3 className="font-medium text-slate-900 mb-3">{goal.name}</h3>

                {/* Circular Progress */}
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-200"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 36 * (1 - progress / 100)
                      }}
                      transition={{ duration: 1.5, delay: index * 0.2 }}
                      className={isOnTrack ? 'text-green-500' : 'text-yellow-500'}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-900">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">
                    {goal.current}{goal.unit}
                  </p>
                  <p className="text-sm text-slate-500">
                    / {goal.target}{goal.unit}
                  </p>
                  <p className={`text-xs font-medium ${
                    isOnTrack ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {isOnTrack ? 'Tavoitteessa' : 'Vaatii huomiota'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}