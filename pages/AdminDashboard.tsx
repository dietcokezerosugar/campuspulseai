import React from 'react';
import { IssueReport, IssueStatus, IssueCategory, IssuePriority, ReportType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Lightbulb } from 'lucide-react';

interface AdminDashboardProps {
  issues: IssueReport[];
  isDarkMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ issues, isDarkMode }) => {
  // Compute Stats
  const totalIssues = issues.length;
  const openIssues = issues.filter(i => i.status === IssueStatus.OPEN).length;
  const resolvedIssues = issues.filter(i => i.status === IssueStatus.RESOLVED).length;
  const suggestions = issues.filter(i => i.type === ReportType.SUGGESTION).length;
  const criticalIssues = issues.filter(i => i.priority === IssuePriority.CRITICAL && i.status !== IssueStatus.RESOLVED).length;

  // Chart Data: Category Breakdown
  const categoryData = Object.values(IssueCategory).map(cat => ({
    name: cat,
    value: issues.filter(i => i.category === cat).length
  })).filter(d => d.value > 0);

  // Chart Data: Status
  const statusData = [
    { name: 'Open', value: openIssues, color: '#EF4444' }, // Red
    { name: 'In Progress', value: issues.filter(i => i.status === IssueStatus.IN_PROGRESS).length, color: '#3B82F6' }, // Blue
    { name: 'Resolved', value: resolvedIssues, color: '#10B981' }, // Green
  ];

  const chartTextColor = isDarkMode ? "#9CA3AF" : "#64748b"; // Secondary text
  const tooltipBg = isDarkMode ? "#0A0A0A" : "#ffffff"; // Surface
  const tooltipText = isDarkMode ? "#E5E7EB" : "#1e293b"; // Primary text

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-[#E5E7EB]">System Analytics</h2>
        <p className="text-slate-500 dark:text-[#9CA3AF]">Overview of campus health and issue resolution</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Reports" value={totalIssues} icon={TrendingUp} color="bg-slate-100 dark:bg-[#0F0F0F] text-slate-600 dark:text-[#E5E7EB]" />
        <StatCard title="Suggestions" value={suggestions} icon={Lightbulb} color="bg-amber-100 dark:bg-[#F59E0B]/20 text-amber-600 dark:text-[#F59E0B]" />
        <StatCard title="Open Issues" value={openIssues} icon={AlertCircle} color="bg-red-100 dark:bg-[#EF4444]/20 text-red-600 dark:text-[#EF4444]" />
        <StatCard title="Resolved" value={resolvedIssues} icon={CheckCircle} color="bg-green-100 dark:bg-[#10B981]/20 text-green-600 dark:text-[#10B981]" />
        <StatCard title="Critical Pending" value={criticalIssues} icon={Clock} color="bg-orange-100 dark:bg-[#F59E0B]/20 text-orange-600 dark:text-[#F59E0B]" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Category Chart */}
        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
          <h3 className="font-bold text-slate-800 dark:text-[#E5E7EB] mb-6">Reports by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0"} />
                <XAxis dataKey="name" stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: isDarkMode ? '#0F0F0F' : '#F1F5F9' }}
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: '8px',
                    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: tooltipText
                  }}
                  itemStyle={{ color: tooltipText }}
                />
                <Bar dataKey="value" fill="#F472B6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
          <h3 className="font-bold text-slate-800 dark:text-[#E5E7EB] mb-6">Resolution Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke={isDarkMode ? "#000000" : "#fff"}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderRadius: '8px',
                    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: tooltipText
                  }}
                  itemStyle={{ color: tooltipText }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center text-xs text-slate-600 dark:text-[#9CA3AF]">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: d.color }}></div>
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between transition-colors">
    <div>
      <p className="text-slate-500 dark:text-[#9CA3AF] text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-[#E5E7EB]">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);