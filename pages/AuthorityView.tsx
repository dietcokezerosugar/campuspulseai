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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance Authority Portal</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage and resolve assigned tasks</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {myTasks.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${issue.priority === IssuePriority.CRITICAL ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' : 
                      issue.priority === IssuePriority.HIGH ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'}`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{issue.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{issue.category}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{issue.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${issue.status === IssueStatus.OPEN ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {issue.status === IssueStatus.OPEN && (
                      <button 
                        onClick={() => onUpdateStatus(issue.id, IssueStatus.IN_PROGRESS)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Start Work <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    )}
                    {issue.status === IssueStatus.IN_PROGRESS && (
                      <button 
                        onClick={() => onUpdateStatus(issue.id, IssueStatus.RESOLVED)}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 flex items-center bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
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
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                No pending tasks! Good job.
            </div>
        )}
      </div>
    </div>
  );
};