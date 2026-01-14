import React from 'react';
import { IssueReport, IssueStatus, IssuePriority, ReportType } from '../types';
import { Clock, MapPin, CheckCircle2, AlertCircle, Lightbulb, AlertOctagon } from 'lucide-react';

interface IssueFeedProps {
  issues: IssueReport[];
}

export const IssueFeed: React.FC<IssueFeedProps> = ({ issues }) => {
  const [filter, setFilter] = React.useState<IssueStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = React.useState<'ALL' | ReportType>('ALL');

  const filteredIssues = issues.filter(i =>
    (filter === 'ALL' || i.status === filter) &&
    (typeFilter === 'ALL' || i.type === typeFilter)
  ).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-[#E5E7EB]">Campus Issue Feed</h2>
          <p className="text-slate-500 dark:text-[#9CA3AF] text-sm">Real-time status of reported problems and suggestions</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#0A0A0A] border border-white/5">
            {['ALL', IssueStatus.OPEN, IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${filter === status
                  ? 'bg-[#F472B6]/15 text-[#F472B6] border border-[#F472B6]/30'
                  : 'text-[#6B7280] hover:text-[#9CA3AF] border border-transparent'
                  }`}
              >
                {status === 'ALL' ? 'All' : status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#0A0A0A] border border-white/5">
            {['ALL', ReportType.PROBLEM, ReportType.SUGGESTION].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${typeFilter === type
                  ? 'bg-[#F472B6]/15 text-[#F472B6] border border-[#F472B6]/30'
                  : 'text-[#6B7280] hover:text-[#9CA3AF] border border-transparent'
                  }`}
              >
                {type === 'ALL' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
        {filteredIssues.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 dark:text-[#6B7280] bg-white dark:bg-[#0A0A0A] rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
            No items found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
};

const IssueCard: React.FC<{ issue: IssueReport }> = ({ issue }) => {
  const statusColor = {
    [IssueStatus.OPEN]: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30',
    [IssueStatus.IN_PROGRESS]: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
    [IssueStatus.RESOLVED]: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
  };

  const statusIcon = {
    [IssueStatus.OPEN]: AlertCircle,
    [IssueStatus.IN_PROGRESS]: Clock,
    [IssueStatus.RESOLVED]: CheckCircle2,
  };

  const Icon = statusIcon[issue.status];
  const isSuggestion = issue.type === ReportType.SUGGESTION;

  return (
    <div className={`rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden 
      ${isSuggestion
        ? 'bg-amber-50/50 dark:bg-[#F59E0B]/10 border-amber-100 dark:border-[#F59E0B]/20'
        : 'bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5'}`}>

      {/* Type Badge */}
      <div className={`absolute top-0 right-0 p-2 rounded-bl-xl 
        ${isSuggestion
          ? 'bg-amber-100 dark:bg-[#F59E0B]/30 text-amber-700 dark:text-[#F59E0B]'
          : 'bg-slate-100 dark:bg-[#0F0F0F] text-slate-500 dark:text-[#9CA3AF]'}`}>
        {isSuggestion ? <Lightbulb size={16} /> : <AlertOctagon size={16} />}
      </div>

      <div className="flex justify-between items-start mb-3 pr-8">
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${issue.priority === IssuePriority.CRITICAL
          ? 'bg-[#EF4444] text-white'
          : 'bg-slate-100 dark:bg-[#0F0F0F] text-slate-600 dark:text-[#E5E7EB]'
          }`}>
          {issue.priority}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 dark:text-[#E5E7EB] mb-2 line-clamp-2">{issue.title}</h3>
      <p className="text-slate-500 dark:text-[#9CA3AF] text-sm mb-4 line-clamp-3 flex-grow">{issue.description}</p>

      <div className="space-y-3 pt-4 border-t border-slate-100/50 dark:border-slate-700">
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
          <MapPin className="h-3 w-3 mr-1.5 text-slate-400" />
          {issue.location}
        </div>

        <div className={`flex items-center justify-center p-2 rounded-lg border ${statusColor[issue.status]}`}>
          <Icon className="h-4 w-4 mr-2" />
          <span className="text-xs font-bold uppercase">{issue.status}</span>
        </div>
      </div>
    </div>
  );
};