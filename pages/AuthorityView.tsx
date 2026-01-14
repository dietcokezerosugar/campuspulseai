import React from 'react';
import { IssueReport, IssueStatus, IssuePriority } from '../types';
import { CheckSquare, ArrowRight } from 'lucide-react';

interface AuthorityViewProps {
  issues: IssueReport[];
  onUpdateStatus: (id: string, status: IssueStatus) => void;
}

export const AuthorityView: React.FC<AuthorityViewProps> = ({ issues, onUpdateStatus }) => {
  const myTasks = issues.filter(i => i.status !== IssueStatus.RESOLVED).sort((a, b) => {
    // Critical first
    if (a.priority === IssuePriority.CRITICAL) return -1;
    if (b.priority === IssuePriority.CRITICAL) return 1;
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-[#E5E7EB]">Maintenance Authority Portal</h2>
        <p className="text-slate-500 dark:text-[#6B7280]">Manage and resolve assigned tasks</p>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5">
          <thead className="bg-slate-50 dark:bg-[#0F0F0F]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-[#6B7280] uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-[#6B7280] uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-[#6B7280] uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-[#6B7280] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#0A0A0A] divide-y divide-slate-200 dark:divide-white/5">
            {myTasks.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-[#0F0F0F] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${issue.priority === IssuePriority.CRITICAL ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                      issue.priority === IssuePriority.HIGH ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-[#22C55E]/20 text-[#22C55E]'}`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900 dark:text-[#E5E7EB]">{issue.title}</div>
                  <div className="text-xs text-slate-500 dark:text-[#6B7280]">{issue.category}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-[#9CA3AF]">{issue.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${issue.status === IssueStatus.OPEN ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {issue.status === IssueStatus.OPEN && (
                      <button
                        onClick={() => onUpdateStatus(issue.id, IssueStatus.IN_PROGRESS)}
                        className="text-[#3B82F6] hover:text-[#60A5FA] flex items-center bg-[#3B82F6]/10 px-3 py-1 rounded hover:bg-[#3B82F6]/20 transition-colors"
                      >
                        Start Work <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    )}
                    {issue.status === IssueStatus.IN_PROGRESS && (
                      <button
                        onClick={() => onUpdateStatus(issue.id, IssueStatus.RESOLVED)}
                        className="text-[#10B981] hover:text-[#34D399] flex items-center bg-[#10B981]/10 px-3 py-1 rounded hover:bg-[#10B981]/20 transition-colors"
                      >
                        Resolve <CheckSquare className="ml-1 h-3 w-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {myTasks.length === 0 && (
          <div className="p-12 text-center text-slate-500 dark:text-[#6B7280]">
            No pending tasks! Good job.
          </div>
        )}
      </div>
    </div>
  );
};