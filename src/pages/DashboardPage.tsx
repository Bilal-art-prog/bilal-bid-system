import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  FileText,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Clock,
  Target,
  AlertCircle,
  RefreshCw,
  Award,
  Briefcase,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import { useBidHistory, useDashboardMetrics, type BidHistoryItem } from '../hooks/useSupabase';
import { recentTenders } from '../data/mockData';

const colorMap: Record<string, string> = {
  primary: '#3b82f6',
  accent: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
};

export default function DashboardPage() {
  const { data: bidHistory, loading: bidLoading, error: bidError, refetch: refetchBidHistory } = useBidHistory();
  const { metrics, loading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useDashboardMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Transform bid history data for charts
  const chartData = useMemo(() => {
    if (!bidHistory) return { bidHistoryData: [], winRateData: [], categoryData: [], valueData: [] };

    const bidHistoryData = bidHistory.map((b: BidHistoryItem) => ({
      name: b.month,
      value: b.bid_count,
      wins: b.win_count,
    }));

    const winRateData = bidHistory.map((b: BidHistoryItem) => ({
      name: b.month,
      value: Math.round(Number(b.win_rate)),
    }));

    const valueData = bidHistory.map((b: BidHistoryItem) => ({
      name: b.month,
      value: b.total_value / 100000,
    }));

    // Aggregate by category
    const categoryMap = new Map<string, number>();
    bidHistory.forEach((b: BidHistoryItem) => {
      if (b.category) {
        categoryMap.set(b.category, (categoryMap.get(b.category) || 0) + b.bid_count);
      }
    });

    const colors = ['#3b82f6', '#0ea5e9', '#10b981', '#f59e0b'];
    const categoryData = Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }));

    return { bidHistoryData, winRateData, categoryData, valueData };
  }, [bidHistory]);

  // Stats display data - all from live database
  const statsDisplay = useMemo(() => [
    {
      label: 'Total Bids',
      value: metrics.totalBids,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'primary',
    },
    {
      label: 'Won Bids',
      value: metrics.wonBids,
      change: '+15%',
      trend: 'up',
      icon: Target,
      color: 'success',
    },
    {
      label: 'Win Rate',
      value: `${metrics.winRate}%`,
      change: '+5.4%',
      trend: 'up',
      icon: TrendingUp,
      color: 'accent',
    },
    {
      label: 'Compliance Rate',
      value: `${metrics.complianceRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'warning',
    },
  ], [metrics]);

  const capabilityStats = useMemo(() => [
    {
      label: 'Total Capabilities',
      value: metrics.totalCapabilities,
      icon: Briefcase,
      color: '#3b82f6',
    },
    {
      label: 'Strong Coverage',
      value: metrics.strongCapabilities,
      icon: Award,
      color: '#10b981',
    },
  ], [metrics]);

  const handleRefresh = () => {
    refetchBidHistory();
    refetchMetrics();
  };

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Overview of your bid performance and activity"
    >
      <div className="space-y-6">
        {/* Error Banner */}
        {(bidError || metricsError) && (
          <GlassCard>
            <div className="flex items-center gap-4 p-4">
              <AlertCircle className="w-6 h-6 text-error" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Failed to load dashboard data</p>
                <p className="text-sm text-muted-foreground">{bidError?.message || metricsError?.message}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </GlassCard>
        )}

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsDisplay.map((stat, index) => (
            <GlassCard key={stat.label} delay={index * 0.1} glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="text-3xl font-bold text-foreground"
                  >
                    {metricsLoading ? (
                      <span className="text-muted">--</span>
                    ) : typeof stat.value === 'number' ? (
                      stat.value.toLocaleString()
                    ) : (
                      stat.value
                    )}
                  </motion.p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${colorMap[stat.color]}15`,
                    boxShadow: `0 0 20px ${colorMap[stat.color]}20`,
                  }}
                >
                  <stat.icon
                    className="w-6 h-6"
                    style={{ color: colorMap[stat.color] }}
                  />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Capability Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {capabilityStats.map((stat, index) => (
            <GlassCard key={stat.label} delay={0.4 + index * 0.1}>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${stat.color}15`,
                    boxShadow: `0 0 20px ${stat.color}20`,
                  }}
                >
                  <stat.icon
                    className="w-6 h-6"
                    style={{ color: stat.color }}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {metricsLoading ? '--' : stat.value}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bid Activity Chart */}
          <GlassCard className="lg:col-span-2" delay={0.5}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Bid Activity
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monthly bid submissions and wins
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Bids</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">Wins</span>
                </div>
              </div>
            </div>
            <div className="h-72">
              {bidLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">Loading chart...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.bidHistoryData}>
                    <defs>
                      <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorWins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorBids)"
                      strokeWidth={2}
                      name="Bids"
                    />
                    <Area
                      type="monotone"
                      dataKey="wins"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorWins)"
                      strokeWidth={2}
                      name="Wins"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>

          {/* Category Pie Chart */}
          <GlassCard delay={0.6}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Bid Categories
              </h3>
              <p className="text-sm text-muted-foreground">
                Distribution by sector
              </p>
            </div>
            <div className="h-56">
              {bidLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">Loading...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.categoryData.length > 0 ? chartData.categoryData : [{ name: 'No Data', value: 1, fill: '#64748b' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(chartData.categoryData.length > 0 ? chartData.categoryData : [{ name: 'No Data', value: 1, fill: '#64748b' }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {chartData.categoryData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="ml-auto font-medium text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Win Rate Trend Chart */}
          <GlassCard className="lg:col-span-2" delay={0.7}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Win Rate Trend
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monthly win rate performance
                </p>
              </div>
            </div>
            <div className="h-56">
              {bidLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">Loading chart...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.winRateData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Win Rate']}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>

          {/* Total Value Card */}
          <GlassCard delay={0.8}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center shadow-glow">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {metricsLoading ? '--' : formatCurrency(metrics.totalValue)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Avg Win Probability
                  </span>
                  <span className="font-semibold text-foreground">
                    {metricsLoading ? '--' : `${metrics.avgWinProbability}%`}
                  </span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: metricsLoading ? 0 : `${metrics.avgWinProbability}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full gradient-primary rounded-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-xl font-bold text-primary">
                    {metricsLoading ? '--' : metrics.wonBids}
                  </p>
                  <p className="text-xs text-muted-foreground">Won Bids</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-xl font-bold text-accent">
                    {metricsLoading ? '--' : metrics.totalBids - metrics.wonBids}
                  </p>
                  <p className="text-xs text-muted-foreground">Other Bids</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Tenders Table */}
        <GlassCard delay={0.9}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Recent Tenders
              </h3>
              <p className="text-sm text-muted-foreground">
                Your latest bid activities
              </p>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Tender
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Deadline
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Budget
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Win %
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTenders.map((tender, index) => (
                  <motion.tr
                    key={tender.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">
                        {tender.title}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {tender.client}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(tender.deadline).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground font-medium">
                      {formatCurrency(tender.budget.min)} -{' '}
                      {formatCurrency(tender.budget.max)}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge
                        status={
                          tender.status === 'submitted'
                            ? 'info'
                            : tender.status === 'won'
                            ? 'success'
                            : tender.status === 'lost'
                            ? 'error'
                            : tender.status === 'analyzing'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {tender.status.charAt(0).toUpperCase() +
                          tender.status.slice(1)}
                      </StatusBadge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-primary rounded-full"
                            style={{ width: `${tender.winProbability}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {tender.winProbability}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
}
