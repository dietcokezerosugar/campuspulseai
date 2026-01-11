import { IssueCategory, IssuePriority, IssueReport, IssueStatus, ReportType } from './types';

export const MOCK_ISSUES: IssueReport[] = [
  {
    id: 'iss_1',
    type: ReportType.PROBLEM,
    title: 'Broken Projector in Room 302',
    description: 'The projector keeps flickering and turning off during lectures.',
    category: IssueCategory.IT,
    priority: IssuePriority.MEDIUM,
    status: IssueStatus.OPEN,
    location: 'Science Block, Room 302',
    department: 'IT Support',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    aiConfidence: 0.95
  },
  {
    id: 'iss_2',
    type: ReportType.PROBLEM,
    title: 'Water Leak in 2nd Floor Washroom',
    description: 'There is a large puddle forming near the sinks. Slippery hazard.',
    category: IssueCategory.PLUMBING,
    priority: IssuePriority.HIGH,
    status: IssueStatus.IN_PROGRESS,
    location: 'Library, 2nd Floor',
    department: 'Facilities',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    aiConfidence: 0.98,
    assignedTo: 'John Plumber'
  },
  {
    id: 'iss_3',
    type: ReportType.PROBLEM,
    title: 'Street Light Out at North Gate',
    description: 'The main light at the north entrance is completely dark. Unsafe.',
    category: IssueCategory.ELECTRICAL,
    priority: IssuePriority.CRITICAL,
    status: IssueStatus.RESOLVED,
    location: 'North Campus Gate',
    department: 'Campus Security',
    createdAt: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    resolvedAt: Date.now() - 1000 * 60 * 60 * 12,
    aiConfidence: 0.92,
    assignedTo: 'Mike Electric'
  },
  {
    id: 'iss_4',
    type: ReportType.PROBLEM,
    title: 'Trash Overflowing',
    description: 'Cafeteria bins are full and spilling over.',
    category: IssueCategory.CLEANLINESS,
    priority: IssuePriority.LOW,
    status: IssueStatus.OPEN,
    location: 'Student Center Cafeteria',
    department: 'Janitorial Services',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 mins ago
    aiConfidence: 0.88
  },
  {
    id: 'iss_5',
    type: ReportType.SUGGESTION,
    title: 'Install More Power Outlets',
    description: 'The library study area needs more power outlets for laptops. Currently, students have to sit on the floor near the walls.',
    category: IssueCategory.OTHER,
    priority: IssuePriority.LOW,
    status: IssueStatus.OPEN,
    location: 'Library Main Hall',
    department: 'Facilities',
    createdAt: Date.now() - 1000 * 60 * 60 * 5, 
    aiConfidence: 0.90
  }
];

export const DEPARTMENT_MAP: Record<IssueCategory, string> = {
  [IssueCategory.MAINTENANCE]: 'General Maintenance',
  [IssueCategory.PLUMBING]: 'Facilities - Plumbing',
  [IssueCategory.ELECTRICAL]: 'Facilities - Electrical',
  [IssueCategory.IT]: 'IT Support Desk',
  [IssueCategory.SECURITY]: 'Campus Safety',
  [IssueCategory.CLEANLINESS]: 'Janitorial Services',
  [IssueCategory.OTHER]: 'Student Affairs'
};