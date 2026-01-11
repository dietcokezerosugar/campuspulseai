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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Campus Issue Feed</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time status of reported problems and suggestions</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                {['ALL', IssueStatus.OPEN, IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED].map((status) => (
                    <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        filter === status 
                        ? 'bg-slate-900 dark:bg-slate-600 text-white shadow' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                    >
                    {status === 'ALL' ? 'All Status' : status}
                    </button>
                ))}
            </div>

            {/* Type Filter */}
             <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                {['ALL', ReportType.PROBLEM, ReportType.SUGGESTION].map((type) => (
                    <button
                    key={type}
                    onClick={() => setTypeFilter(type as any)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        typeFilter === type 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                    >
                    {type === 'ALL' ? 'All Types' : type}
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
          <div className="col-span-full py-20 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
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
        ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20' 
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
      
      {/* Type Badge */}
      <div className={`absolute top-0 right-0 p-2 rounded-bl-xl 
        ${isSuggestion 
          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' 
          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
        {isSuggestion ? <Lightbulb size={16} /> : <AlertOctagon size={16} />}
      </div>

      <div className="flex justify-between items-start mb-3 pr-8">
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
          issue.priority === IssuePriority.CRITICAL 
            ? 'bg-red-600 text-white' 
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}>
          {issue.priority}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{issue.title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">{issue.description}</p>

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