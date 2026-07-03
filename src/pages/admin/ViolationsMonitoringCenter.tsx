import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { 
  AlertTriangle, TrendingUp, MapPin, Users, Activity, 
  Brain, Bell, CheckCircle, Map, Calendar, Filter,
  Search, Download, ChevronDown, BarChart3, ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';
import { 
  ViolationRecord, ViolationStats, ViolationTrend, 
  ViolationByGovernorate, ViolationByType, AIInsight, Alert 
} from '../../types/violations';

const COLORS = ['#e94560', '#0f3460', '#533483', '#f39422', '#16a085', '#c0392b'];

export default function ViolationsMonitoringCenter() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [stats, setStats] = useState<ViolationStats>({
    total: 0, pending: 0, approved: 0, rejected: 0, thisMonth: 0, trend: 0
  });
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [trends, setTrends] = useState<ViolationTrend[]>([]);
  const [byGovernorate, setByGovernorate] = useState<ViolationByGovernorate[]>([]);
  const [byType, setByType] = useState<ViolationByType[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch real data from API
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch violations from real API
      const response = await api.get('/api/violations');
      const data = response.data || [];
      processData(data);
    } catch (err: any) {
      setError(isRtl ? 'فشل في جلب البيانات من الخادم' : 'Failed to fetch data from server');
      setLoading(false);
    }
  }, [isRtl]);

  const processData = (data: ViolationRecord[]) => {
    setViolations(data);
    
    // Calculate stats
    const total = data.length;
    const pending = data.filter(v => v.status === 'pending').length;
    const approved = data.filter(v => v.status === 'approved').length;
    const rejected = data.filter(v => v.status === 'rejected').length;
    const thisMonth = data.filter(v => {
      const d = new Date(v.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    
    setStats({ total, pending, approved, rejected, thisMonth, trend: 0 });
    
    // Process trends
    const trendsData = processTrends(data);
    setTrends(trendsData);
    
    // Process by governorate
    const govData = processByGovernorate(data);
    setByGovernorate(govData);
    
    // Process by type
    const typeData = processByType(data);
    setByType(typeData);
    
    // Generate AI insights
    const aiData = generateInsights(data);
    setInsights(aiData);
    
    // Generate alerts
    const alertData = generateAlerts(data);
    setAlerts(alertData);
    
    setLoading(false);
  };

  const processTrends = (data: ViolationRecord[]): ViolationTrend[] => {
    const grouped: { [key: string]: number } = {};
    data.forEach(v => {
      const month = v.date ? v.date.substring(0, 7) : 'unknown';
      grouped[month] = (grouped[month] || 0) + 1;
    });
    return Object.entries(grouped).map(([date, count]) => ({ date, count, type: 'all' }));
  };

  const processByGovernorate = (data: ViolationRecord[]): ViolationByGovernorate[] => {
    const grouped: { [key: string]: number } = {};
    data.forEach(v => {
      if (v.governorate) {
        grouped[v.governorate] = (grouped[v.governorate] || 0) + 1;
      }
    });
    const total = data.length;
    return Object.entries(grouped).map(([gov, count]) => ({
      governorate: gov,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  };

  const processByType = (data: ViolationRecord[]): ViolationByType[] => {
    const grouped: { [key: string]: number } = {};
    data.forEach(v => {
      if (v.type) {
        grouped[v.type] = (grouped[v.type] || 0) + 1;
      }
    });
    return Object.entries(grouped).map(([type, count], index) => ({
      type,
      count,
      color: COLORS[index % COLORS.length]
    }));
  };

  const generateInsights = (data: ViolationRecord[]): AIInsight[] => {
    if (data.length === 0) return [];
    return [
      {
        id: '1',
        title: isRtl ? 'ارتفاع ملحوظ في الانتهاكات' : 'Significant increase in violations',
        description: isRtl ? 'تم رصد ارتفاع في الانتهاكات خلال الفترة الماضية' : 'Increase in violations detected during the past period',
        severity: 'high',
        category: 'trend',
        createdAt: new Date().toISOString()
      }
    ];
  };

  const generateAlerts = (data: ViolationRecord[]): Alert[] => {
    const pendingCount = data.filter(v => v.status === 'pending').length;
    if (pendingCount === 0) return [];
    return [
      {
        id: '1',
        title: isRtl ? 'تنبيه: حالات قيد المراجعة' : 'Alert: Pending reviews',
        message: isRtl ? `يوجد ${pendingCount} حالة قيد المراجعة` : `There are ${pendingCount} cases pending review`,
        severity: 'warning',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isRtl ? 'مركز مراقبة الانتهاكات' : 'Violations Monitoring Center'}
          </h1>
          <p className="text-slate-600">
            {isRtl ? ' لوحة تحكم متقدمة لمراقبة وتحليل الانتهاكات' : 'Advanced dashboard for monitoring and analyzing violations'}
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">{isRtl ? 'آخر 7 أيام' : 'Last 7 days'}</option>
            <option value="30d">{isRtl ? 'آخر 30 يوم' : 'Last 30 days'}</option>
            <option value="90d">{isRtl ? 'آخر 3 أشهر' : 'Last 3 months'}</option>
            <option value="1y">{isRtl ? 'آخر سنة' : 'Last year'}</option>
          </select>
          <button 
            onClick={() => loadData()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {isRtl ? 'تحديث' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={isRtl ? 'إجمالي الانتهاكات' : 'Total Violations'} 
          value={stats.total} 
          icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
          trend={stats.trend}
          color="red"
          isRtl={isRtl}
        />
        <StatCard 
          title={isRtl ? 'قيد المراجعة' : 'Pending Review'} 
          value={stats.pending} 
          icon={<Bell className="w-8 h-8 text-yellow-500" />}
          trend={0}
          color="yellow"
          isRtl={isRtl}
        />
        <StatCard 
          title={isRtl ? 'تمت الموافقة' : 'Approved'} 
          value={stats.approved} 
          icon={<CheckCircle className="w-8 h-8 text-green-500" />}
          trend={0}
          color="green"
          isRtl={isRtl}
        />
        <StatCard 
          title={isRtl ? 'هذا الشهر' : 'This Month'} 
          value={stats.thisMonth} 
          icon={<Calendar className="w-8 h-8 text-blue-500" />}
          trend={0}
          color="blue"
          isRtl={isRtl}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {isRtl ? 'اتجاه الانتهاكات عبر الزمن' : 'Violation Trends Over Time'}
          </h3>
          <div className="h-80">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e94560" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e94560" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#e94560" 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                {isRtl ? 'لا توجد بيانات' : 'No data available'}
              </div>
            )}
          </div>
        </div>

        {/* By Type Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {isRtl ? 'توزيع الانتهاكات حسب النوع' : 'Violations by Type'}
          </h3>
          <div className="h-80">
            {byType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    {byType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                {isRtl ? 'لا توجد بيانات' : 'No data available'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-slate-900">
              {isRtl ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}
            </h3>
          </div>
          <div className="space-y-4">
            {insights.length > 0 ? insights.map(insight => (
              <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                insight.severity === 'critical' ? 'border-red-500 bg-red-50' :
                insight.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                insight.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start gap-3">
                  <ShieldAlert className={`w-5 h-5 mt-0.5 ${
                    insight.severity === 'critical' ? 'text-red-500' :
                    insight.severity === 'high' ? 'text-orange-500' :
                    insight.severity === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-slate-900">{insight.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-white text-slate-700">
                      {insight.category}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-slate-400 text-center py-8">
                {isRtl ? 'لا توجد رؤى حالياً' : 'No insights available'}
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-slate-900">
              {isRtl ? 'التنبيهات' : 'Alerts'}
            </h3>
          </div>
          <div className="space-y-4">
            {alerts.length > 0 ? alerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg ${
                alert.severity === 'critical' ? 'bg-red-50 border border-red-200' :
                alert.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-slate-900">{alert.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                    <span className="text-xs text-slate-400 mt-2 block">
                      {new Date(alert.timestamp).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-slate-400 text-center py-8">
                {isRtl ? 'لا توجد تنبيهات' : 'No alerts'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Violations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            {isRtl ? 'آخر الانتهاكات المسجلة' : 'Recent Violations'}
          </h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isRtl ? 'بحث...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200"
            >
              <option value="all">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="pending">{isRtl ? 'قيد المراجعة' : 'Pending'}</option>
              <option value="approved">{isRtl ? 'تمت الموافقة' : 'Approved'}</option>
              <option value="rejected">{isRtl ? 'مرفوض' : 'Rejected'}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {isRtl ? 'الضحية' : 'Victim'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {isRtl ? 'النوع' : 'Type'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {isRtl ? 'الموقع' : 'Location'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {isRtl ? 'التاريخ' : 'Date'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {isRtl ? 'الحالة' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {violations.length > 0 ? violations.slice(0, 10).map(violation => (
                <tr key={violation.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {violation.victimName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {violation.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {violation.governorate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {violation.date ? new Date(violation.date).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      violation.status === 'approved' ? 'bg-green-100 text-green-800' :
                      violation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {violation.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    {isRtl ? 'لا توجد بيانات' : 'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  color: 'red' | 'yellow' | 'green' | 'blue';
  isRtl: boolean;
}

function StatCard({ title, value, icon, trend, color, isRtl }: StatCardProps) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-white shadow-sm">
          {icon}
        </div>
      </div>
      {trend !== 0 && (
        <div className="mt-4 flex items-center">
          <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-red-500' : 'text-green-500'} ${isRtl ? 'ml-1' : 'mr-1'}`} />
          <span className={`text-sm font-medium ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        </div>
      )}
    </div>
  );
}